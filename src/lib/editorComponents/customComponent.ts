import { Node, mergeAttributes } from "@tiptap/core";

// Define the types for the custom component attributes
export type CustomComponentAttributes = {
	name: string;
	props: Record<string, unknown>;
};

declare module "@tiptap/core" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Commands<ReturnType> {
		customComponent: {
			insertCustomComponent: (options: CustomComponentAttributes) => ReturnType;
		};
	}
}

export default Node.create({
	name: "customComponent",

	group: "block",
	atom: true,

	// Define the attributes for the node
	addAttributes() {
		return {
			name: {
				default: "",
			},
			props: {
				default: {},
			},
		};
	},

	// Define how this node is parsed from HTML
	parseHTML() {
		return [
			{
				tag: 'div[data-node-type="customComponent"]',
			},
		];
	},

	// Define how this node renders to HTML
	renderHTML({ node, HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-node-type": "customComponent",
				"data-props": JSON.stringify(node.attrs.props),
				class: "custom-component-placeholder",
				contenteditable: "false",
			}),
			`Custom Component: ${JSON.stringify(node.attrs.name)}`,
		];
	},

	// Add a custom command for inserting the node with dynamic props
	addCommands() {
		return {
			insertCustomComponent:
				(options: CustomComponentAttributes) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: {
							name: options.name,
							props: options.props,
						},
					});
				},
		};
	},
});
