import { Emitter, EventType } from "@Model/Emitter";

/**
 * 任意类型对象
 */
type IAnyObject = Record<string, any>;

/**
 * 渲染器参数
 */
interface IRendererParam {

	/**
	 * 绘制点需要的参数
	 */
	points?: IAnyObject

	/**
	 * 绘制立方体需要的参数
	 */
	cube?: IAnyObject
}

/**
 * 统一参数
 */
interface ICommonParam {

	/**
	 * 颜色
	 */
	color?: ObjectData;
}

/**
 * 对象标识符
 */
type ObjectID = Symbol | string | number;

/**
 * 接收的数据类型
 */
type ObjectData = Array<number> | Float32Array;

interface IRendererConstructor<
	M extends IAnyObject = {}
> {
	new (canvas: HTMLCanvasElement, param?: M): AbstractRenderer<
		IRendererParam, IAnyObject, Record<EventType, any>
	>
}

/**
 * 渲染器 API
 * @template P 渲染器绘制参数
 * @template M 渲染器参数
 * @template E 渲染器事件
 */
abstract class AbstractRenderer<
	P extends IRendererParam = {},
	M extends IAnyObject = {},
	E extends Record<EventType, any> = {}
> extends Emitter<E> {

	/**
	 * 渲染器参数
	 */
	abstract param: Partial<M>;

	/**
	 * 类型断言
	 */
	get isRenderer() {
		return true;
	}

	/**
	 * 断言对象是否是渲染器
	 */
	public static isRenderer(render: any): render is AbstractRenderer {
		if (render instanceof Object) {
			return !!(render as AbstractRenderer).isRenderer;
		} else {
			return false;
		}
	};

	/**
	 * @function start 
	 * 开始一次数据更新 \
	 * 此函数将清除固定对象的绘制状态 \
	 * 在每次数据更新前调用 \
	 * 传入 ObjectID 清楚指定 ID 的对象 \
	 * 不传入 ObjectID 清楚全部 ID 的对象
	 * 
	 * @param id 需要清除标识符
	 */
	abstract clean(id?: ObjectID | ObjectID[]): this;

	/**
	 * @function points 绘制点集
	 * 
	 * @param id 使用的标识符
	 * @param position 做标集合
	 */
	abstract points(id: ObjectID, position?: ObjectData, param?: Readonly<P["points"] & ICommonParam>): this;

	/**
	 * @function cube 绘制立方体
	 * 
	 * @param id 使用的标识符
	 * @param position 做标集合
	 * 
	 * 注意: 这里的半径指的是立方体重心与立方体任意一面几何中心的距离
	 */
	abstract cube(id: ObjectID, position?: ObjectData, param?: Readonly<P["cube"] & ICommonParam>): this;
}

export default AbstractRenderer;
export { 
    AbstractRenderer, ObjectID, IAnyObject,
    ICommonParam, IRendererParam, 
    ObjectData, IRendererConstructor 
};