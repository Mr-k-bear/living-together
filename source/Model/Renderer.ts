import { Emitter, EventType } from "@Model/Emitter";
import { IAnyObject, ObjectID } from "@Model/Model"; 
import { IParameter, IParameterOption, IParameterValue } from "@Model/Parameter";

/**
 * 默认类型
 */
type IDefaultType<T, D> = T extends undefined ? D : T;

/**
 * 渲染器参数
 */
interface IRendererParam {

	/**
	 * 渲染器参数
	 */
	renderer?: IParameter;

	/**
	 * 绘制点需要的参数
	 */
	points?: IParameter;

	/**
	 * 绘制立方体需要的参数
	 */
	cube?: IParameter;
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
 * 接收的数据类型
 */
type ObjectData = Array<number> | Float32Array;

interface IRendererConstructor {
	new (): AbstractRenderer<IRendererParam, AbstractRendererEvent>
}

type AbstractRendererEvent = {
    [x: EventType]: any;
    loop: number;
}

/**
 * 渲染器 API
 * @template P 渲染器绘制参数
 * @template M 渲染器参数
 * @template E 渲染器事件
 */
abstract class AbstractRenderer<
	P extends IRendererParam = {},
	E extends AbstractRendererEvent = {loop: number}
> extends Emitter<E> {

	abstract dom: HTMLDivElement | HTMLCanvasElement;

	/**
	 * 渲染器参数
	 */
	public rendererParameterOption: IParameterOption<IDefaultType<P["renderer"], {}>> = {} as any;
	public pointsParameterOption: IParameterOption<IDefaultType<P["points"], {}>> = {} as any;
	public cubeParameterOption: IParameterOption<IDefaultType<P["cube"], {}>> = {} as any;

	/**
	 * 渲染器参数
	 */
	public rendererParameter: IParameterValue<IDefaultType<P["renderer"], {}>> = {} as any;

	/**
	 * @function clean 
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
	abstract points(id: ObjectID, position?: ObjectData, param?: 
		Readonly<IParameterValue<IDefaultType<P["points"], {}>>>
	): this;

	/**
	 * @function cube 绘制立方体
	 * 
	 * @param id 使用的标识符
	 * @param position 做标集合
	 * 
	 * 注意: 这里的半径指的是立方体重心与立方体任意一面几何中心的距离
	 */
	abstract cube(id: ObjectID, position?: ObjectData, radius?: ObjectData, param?:
		Readonly<IParameterValue<IDefaultType<P["cube"], {}>>>
	): this;
}

export default AbstractRenderer;
export { 
    AbstractRenderer, ICommonParam, IRendererParam, 
    ObjectData, IRendererConstructor 
};