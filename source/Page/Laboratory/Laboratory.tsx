import { Component, ReactNode, createRef } from "react";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { Entry } from "../Entry/Entry";
import "./Laboratory.scss";

class Laboratory extends Component {
    
    private canvasContRef = createRef<HTMLDivElement>();

    public render(): ReactNode {
        return <div ref={this.canvasContRef} className="main-canvas"></div>
    }

    public componentDidMount() {
        if (!this.canvasContRef.current) {
            throw new Error("Laboratory: 无法获取到 Canvas 容器节点");
        }

        if (this.canvasContRef.current.querySelector("*")) {
            throw new Error("Laboratory: 重复引用 canvas 节点");
        }

        const canvas = document.createElement("canvas");

        const renderer = new ClassicRenderer(canvas, {
            clasName: "canvas"
        });

        console.log(renderer);

        this.canvasContRef.current.appendChild(renderer.canvas.dom);
    }
}

Entry.renderComponent(Laboratory);