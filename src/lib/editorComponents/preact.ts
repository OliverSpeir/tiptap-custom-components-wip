import * as TipTap from "@tiptap/core"
import * as Preact from "preact"
import { useContext } from "preact/hooks"

export default function createNodeForPreactComponent<Props extends {}>(
    tag: string,
    component: Preact.ComponentType<Props>,
    attributes: TipTap.Attributes
): TipTap.Node<any, any> {
    return TipTap.Node.create({
        name: tag,
        group: "block",
        addAttributes() {
            return attributes
        },
        addNodeView() {
            return props => new PreactNodeView(component, props, { tag })
        },
        renderHTML({ HTMLAttributes }) {
            /**
             * Most components are interactive and don't need to be completely
             * rendered to HTML, and some are static and don't need to be hydrated.
             * 
             * This is a stop-gap until we have a better grip on the use-cases.
             * It might be a good idea to use preact-render-to-string, for example.
             */
            return [ tag, TipTap.mergeAttributes(HTMLAttributes) ]
        },
        parseHTML() {
            return [ { tag } ]
        },
    })
}

const NodeViewRendererPropsContext = Preact.createContext<TipTap.NodeViewRendererProps | null>(null as any)

// when might this be necessary?
function useTipTap(): TipTap.NodeViewRendererProps | null {
    return useContext(NodeViewRendererPropsContext)
}

export interface Options extends TipTap.NodeViewRendererOptions {
    tag: string
}

class PreactNodeView<Props extends {}> extends TipTap.NodeView<Preact.ComponentType<Props>, TipTap.Editor, Options> {

    #tag: string

    #props: TipTap.NodeViewRendererProps

    #root?: HTMLElement


    constructor(
        component: Preact.ComponentType<Props>,
        props: TipTap.NodeViewRendererProps,
        options: Partial<Options> & Required<Pick<Options, "tag">>
    ) {
        super(component, props, options)
        this.#tag = options.tag
        this.#props = props
    }

    override get dom() {
        if (import.meta.env.SSR) {
            throw new Error("Cannot use DOM in a server-side environment.")
        }
        if (this.#root){
            return this.#root
        }
        const root = document.createElement(this.#tag)
        Preact.render(
            Preact.h(
                NodeViewRendererPropsContext.Provider, { value: this.#props },
                Preact.h(
                    // @ts-expect-error TODO: investigate whether this typee
                    // error can be fixed. I have a feeling it's going to be
                    // a fruitless time-sink, but I have spent no time on it.
                    this.component, { ...this.#props.node.attrs }
                )
            ),
            root
        )
        this.#root = root
        return root
    }
}
