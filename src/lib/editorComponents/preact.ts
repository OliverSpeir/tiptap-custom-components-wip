import * as TipTap from "@tiptap/core"
import * as Preact from "preact"
import { useContext } from "preact/hooks"
import renderToString from "preact-render-to-string"
import { parseHTML } from "zeed-dom"

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
        renderHTML({ node }) {
            return [
                tag,
                node.attrs,
                // Is this meaningfully inefficient?
                // If it is, it is probably just as simple to run preact's
                // browser renderer with zeed-dom's VHTMLDocument as the
                // parent DOM element.
                parseHTML(renderToString(Preact.h(component, node.attrs as any)))
            ]
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
                NodeViewRendererPropsContext.Provider,
                { value: this.#props },
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
