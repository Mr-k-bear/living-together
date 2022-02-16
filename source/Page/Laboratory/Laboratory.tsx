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
            className: "canvas"
        });

        renderer.onLoad();

        // 测试渲染器
        if (true) {
            renderer.points("0");
            renderer.points("1", new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2));
            renderer.points("2", new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2), {
                size: 100,
                color: [1, 0, 1]
            });
            renderer.points("3", new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2), {
                size: 80,
                color: [0, 1, 1]
            });
            renderer.points("2");
            renderer.cube("4");
            renderer.cube("5", new Array(3).fill(0).map(() => (Math.random() - .5) * 2), {
                radius: new Array(3).fill(0).map(() => Math.random() * 1.2),
                color: [1, 1, 0]
            })
        }

        (window as any).renderer = renderer;

        this.canvasContRef.current.appendChild(renderer.canvas.dom);
    }
}

Entry.renderComponent(Laboratory);