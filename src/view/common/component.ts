export default class Component {
    private children: Component[] = [];

    private node: HTMLElement;

    constructor(
        { tag = 'div', className = '', text = '', },
        ...children: Component[]
    ) {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = text;
        this.node = node;

        if (children) {
            this.appendChildren(children);
        }
    }

    public append(child: Component) {
        this.children.push(child);
        this.node.append(child.getNode());
    }

    public appendChildren(children: Component[]) {
        children.forEach((el) => {
            this.append(el);
        });
    }

    public getNode() {
        return this.node;
    }

    public getChildren() {
        return this.children;
    }

    public setTextContent(content: string) {
        this.node.textContent = content;
    }

    public setAttribute(attribute: string, value: string) {
        this.node.setAttribute(attribute, value);
    }

    public removeAttribute(attribute: string) {
        this.node.removeAttribute(attribute);
    }

    public toggleClass(className: string) {
        this.node.classList.toggle(className);
    }

    public addListener(
        event: string,
        listener: (event: Event) => void,
        options: boolean = false
    ) {
        this.node.addEventListener(event, listener, options);
    }

    public removeListener(
        event: string,
        listener: () => void,
        options: boolean = false
    ) {
        this.node.removeEventListener(event, listener, options);
    }

    destroyChildren() {
        this.children.forEach((child) => {
            child.destroy();
        });
        this.children.length = 0;
    }

    destroy() {
        this.destroyChildren();
        this.node.remove();
    }
}
