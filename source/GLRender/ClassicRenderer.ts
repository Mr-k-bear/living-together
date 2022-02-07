import { AbstractRenderer, ObjectID, ObjectData, ICommonParam } from "@Model/Renderer";
import { GLCanvas, GLCanvasOption } from "./GLCanvas";

interface IRendererOwnParams {}

/**
 * 渲染器参数
 */
type IRendererParams = IRendererOwnParams & GLCanvasOption;

class ClassicRenderer extends AbstractRenderer<{}, IRendererParams> {

	/**
	 * 渲染器参数
	 */
	public param: IRendererParams;

	/**
	 * 使用的画布
	 */
	public canvas: GLCanvas;

	public constructor(canvas: HTMLCanvasElement, param: IRendererParams = {}) {
		super();

		// 初始化参数
		this.param = {
			autoResize: param.autoResize ?? true,
			mouseEvent: param.autoResize ?? true,
			eventLog: param.eventLog ?? false,
			clasName: param.clasName ?? ""
		}
		
		// 实例化画布对象
		this.canvas = new GLCanvas(canvas, this.param);
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