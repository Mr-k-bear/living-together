import { ObjectID, ObjectData, ICommonParam } from "@Model/Renderer";
import { BasicRenderer, IRendererParams } from "./BasicRenderer";
import { BasicsShader } from "./BasicShader";
import { Axis } from "./Axis";

interface IClassicRendererParams {}

class ClassicRenderer extends BasicRenderer<{}, IClassicRendererParams> {

    private basicShader: BasicsShader = undefined as any;
    private axisObject: Axis = undefined as any;

    public onLoad(): void {
        
        // 自动调节分辨率
        this.autoResize();

        this.basicShader = new BasicsShader().bindRenderer(this);

        this.axisObject = new Axis().bindRenderer(this);

        this.canvas.on("mousemove", () => {

            // 相机旋转
            if (this.canvas.mouseDown)
            this.camera.ctrl(this.canvas.mouseMotionX, this.canvas.mouseMotionY);

        });

        this.canvas.on("mousedown", () => {
            this.canvas.can.style.cursor = "grabbing"
        });

        this.canvas.on("mouseup", () => {
            this.canvas.can.style.cursor = "grab"
        })
        
        // 运行
        this.run();
    }

    loop(t: number): void {
        this.cleanCanvas();
        this.camera.generateMat();
        this.axisObject.draw(this.basicShader);
    }

    clean(id?: ObjectID | ObjectID[]): this {
        throw new Error("Method not implemented.");
    }

    points(id: ObjectID, position: ObjectData, param?: ICommonParam): this {
        throw new Error("Method not implemented.");
    }

    cube(id: ObjectID, position: ObjectData, param?: ICommonParam): this {
        throw new Error("Method not implemented.");
    }
}

export default ClassicRenderer;
export { ClassicRenderer };