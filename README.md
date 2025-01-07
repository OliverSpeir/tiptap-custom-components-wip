# Custom tiptap component WIP

Overall idea is you store json from editor in a DB

- [src/lib/editor.ts](./src/lib/editor.ts)
- [src/lib/editorComponents/customComponent.ts](./src/lib/editorComponents/customComponent.ts)
- [src/components/Editor.astro](./src/components/Editor.astro)
- [src/components/Content.astro](./src/components/Content.astro)

Content is where the magic needs to happen, gotta import predined components and replace with astro component... had an idea of how but I forgot it
    - Probably will need some other way of generating the html

At the moment gotta painfully create customCompnent.ts, but ideally would make a way to automate this
