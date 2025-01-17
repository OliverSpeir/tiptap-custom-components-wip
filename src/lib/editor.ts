import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CustomComponent from "./editorComponents/customComponent";
import Counter from "src/components/ExamplePreactComponent.tsx";
import Preact from "src/lib/editorComponents/preact.ts"

const template = document.querySelector<HTMLTemplateElement>("[data-template]")!;

const editor = new Editor({
	element: template.parentElement!,
	extensions: [
		StarterKit,
		Highlight,
		TextAlign.configure({
			types: ["heading", "paragraph"],
		}),
		CustomComponent,
		// it seems like tiptap needs to be told the props
		// upfront, otherwise it doesnt pass them to the component
		// is there a way to avoid this?
		Preact("coun-ter", Counter, { count: { default: 0 } }),
	],
	content: template.innerHTML,
});
template.remove();

const buttons = [
	{
		id: "heading1",
		action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		isActive: () => editor.isActive("heading", { level: 1 }),
	},
	{
		id: "heading2",
		action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		isActive: () => editor.isActive("heading", { level: 2 }),
	},
	{
		id: "heading3",
		action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		isActive: () => editor.isActive("heading", { level: 3 }),
	},
	{
		id: "bold",
		action: () => editor.chain().focus().toggleBold().run(),
		isActive: () => editor.isActive("bold"),
	},
	{
		id: "italic",
		action: () => editor.chain().focus().toggleItalic().run(),
		isActive: () => editor.isActive("italic"),
	},
	{
		id: "strike",
		action: () => editor.chain().focus().toggleStrike().run(),
		isActive: () => editor.isActive("strike"),
	},
	{
		id: "highlight",
		action: () => editor.chain().focus().toggleHighlight().run(),
		isActive: () => editor.isActive("highlight"),
	},
	{
		id: "align-left",
		action: () => editor.chain().focus().setTextAlign("left").run(),
		isActive: () => editor.isActive({ textAlign: "left" }),
	},
	{
		id: "align-center",
		action: () => editor.chain().focus().setTextAlign("center").run(),
		isActive: () => editor.isActive({ textAlign: "center" }),
	},
	{
		id: "align-right",
		action: () => editor.chain().focus().setTextAlign("right").run(),
		isActive: () => editor.isActive({ textAlign: "right" }),
	},
	{
		id: "align-justify",
		action: () => editor.chain().focus().setTextAlign("justify").run(),
		isActive: () => editor.isActive({ textAlign: "justify" }),
	},
	{
		id: "insert-custom",
		action: () =>
			editor
				.chain()
				.focus()
				.insertCustomComponent({ name: "testCustom", props: { foo: "bar" } })
				.run(),
		isActive: () => false,
	},
	{
		id: "insert-framework",
		action: () =>
			editor
				.chain()
				.focus()
				.insertContent({ type: "coun-ter", attrs: { count: 12 } })
				.run(),
		isActive: () => false,
	},
];

buttons.forEach(({ id, action }) => {
	const button = document.querySelector(`#${id}`);
	button?.addEventListener("click", () => {
		action();
		updateButtonStates();
	});
});

const updateButtonStates = () => {
	buttons.forEach(({ id, isActive }) => {
		const button = document.querySelector(`#${id}`);
		if (button) {
			button.classList.toggle("is-active", isActive());
		}
	});
};

editor.on("update", updateButtonStates);
editor.on("selectionUpdate", updateButtonStates);
editor.on("update", () => {
	console.log(editor.getJSON());
});

updateButtonStates();
