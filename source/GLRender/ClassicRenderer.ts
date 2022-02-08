import { ObjectID, ObjectData, ICommonParam } from "@Model/Renderer";
import { BasicRenderer, IRendererParams } from "./BasicRenderer";

interface IClassicRendererParams {}

class ClassicRenderer extends BasicRenderer<{}, IClassicRendererParams> {

    onLoad(param: Partial<IClassicRendererParams & IRendererParams>): void {
        this.run();
        this.autoResize();
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

    loop(): void {
        this.cleanCanvas();
    }
}

export default ClassicRenderer;
export { ClassicRenderer };