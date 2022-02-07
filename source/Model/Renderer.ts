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

	/**
	 * 半径
	 */
	radius?: number;
}

/**
 * 对象标识符
 */
type ObjectID = Symbol | string | number;

/**
 * 接收的数据类型
 */
type ObjectData = Array<number> | Float32Array | Float64Array;

/**
 * 渲染器 API
 */
abstract class AbstractRenderer<
	P extends IRendererParam,
	E extends Record<EventType, any> = {}
> extends Emitter<E> {

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
	abstract points(id: ObjectID, position: ObjectData, param?: P["points"] & ICommonParam): this;

	/**
	 * @function cube 绘制立方体
	 * 
	 * @param id 使用的标识符
	 * @param position 做标集合
	 * 
	 * 注意: 这里的半径指的是立方体重心与立方体任意一面几何中心的距离
	 */
	abstract cube(id: ObjectID, position: ObjectData, param?: P["cube"] & ICommonParam): this;
}

export default AbstractRenderer;
export { AbstractRenderer };