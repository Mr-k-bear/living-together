import { ObjectID, ObjectData, ICommonParam } from "@Model/Renderer";
import { BasicRenderer, IRendererParams } from "./BasicRenderer";
import { BasicsShader } from "./BasicShader";

interface IClassicRendererParams {}

class ClassicRenderer extends BasicRenderer<{}, IClassicRendererParams> {

    onLoad(param: Partial<IClassicRendererParams & IRendererParams>): void {
        
        // 自动调节分辨率
        this.autoResize();

        let shader = new BasicsShader().bindRenderer(this);
        
        // 运行
        this.run();
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

    loop(t: number): void {
        this.cleanCanvas();
    }
}

export default ClassicRenderer;
export { ClassicRenderer };