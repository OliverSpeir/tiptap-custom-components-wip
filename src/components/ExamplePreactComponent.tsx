import { useState } from "preact/hooks"
import "./ExamplePreactComponent.css"

export default ({ count: initialCount }: { count: number }) => {
    const [ count, setCount ] = useState(initialCount)
    return <>
        <label>Preact Component</label>
        <button onClick={(e) => (setCount(count + 1), pop(e.currentTarget))}>
            This button has been clicked { count } times.
        </button>
    </>
}

function pop(button: HTMLButtonElement) {
    button.animate(
        [{}, { scale: 0.9 }, {}],
        { duration: 250, easing: "cubic-bezier(0.5, 0.5, 0.5, 1.5)" }
    )
}
