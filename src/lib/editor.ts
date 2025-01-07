import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CustomComponent from "./editorComponents/customComponent";

const editorElement = document.querySelector<HTMLElement>("#editor");
const editorContentTemplate =
	document.querySelector<HTMLTemplateElement>("#editor-content")?.innerHTML ?? "";

const editor = new Editor({
	...(editorElement ? { element: editorElement } : {}),
	extensions: [
		StarterKit,
		Highlight,
		TextAlign.configure({
			types: ["heading", "paragraph"],
		}),
		CustomComponent,
	],
	content: editorContentTemplate,
});

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
