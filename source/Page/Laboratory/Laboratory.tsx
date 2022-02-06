import { Component, ReactNode, createRef } from "react";
import { GLCanvas } from "@GLRender/GLCanvas";
import { Group } from "@Model/Group";
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

        if (this.canvasContRef.current.getElementsByTagName("canvas").length > 0) {
            throw new Error("Laboratory: 重复引用 canvas 节点");
        }

        const glCanvas = new GLCanvas(undefined, {
            autoResize: true,
            mouseEvent: true,
            eventLog: false
        });

        glCanvas.dom.className = "canvas";
        this.canvasContRef.current.appendChild(glCanvas.dom);
    }
}

Entry.renderComponent(Laboratory);