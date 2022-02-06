
import { Emitter, EventType } from "@Common/Emitter";

export type GLContext = WebGL2RenderingContext | WebGLRenderingContext;

/**
 * 使用 GLContext 的类型
 */
export abstract class GLContextObject<
	E extends Record<EventType, any> = {}
> extends Emitter<E> {

	/**
	 * GL 上下文
	 */
	protected gl: GLContext = undefined as any;

	/**
	 * 是否加载
	 */
	public get isLoad(): boolean {
		return !!this.gl;
	}

	/**
	 * 初始化生命周期
	 */
	public abstract onLoad(context: GLContext): any;
}