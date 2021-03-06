import { Emitter, EventType } from "@Model/Emitter";
import BasicRenderer from "./BasicRenderer";
import Camera from "./Camera";

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
	protected get gl(): GLContext {
		return this.renderer.gl;
	};

	/**
	 * 相机
	 */
	protected get camera(): Camera {
		return this.renderer.camera;
	}

    /**
     * 使用的渲染器
     */
    protected renderer: BasicRenderer = undefined as any;

	/**
	 * 是否加载
	 */
	public get isLoad(): boolean {
		return !!(this.gl && this.renderer);
	}

    /**
     * 初始化
     */
    public bindRenderer(renderer: BasicRenderer): this {
        this.renderer = renderer;
        this.onLoad();
        return this;
    }

	/**
	 * 初始化生命周期
	 */
	abstract onLoad(): any;
}