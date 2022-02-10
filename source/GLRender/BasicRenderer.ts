import { AbstractRenderer, IRendererParam, IAnyObject } from "@Model/Renderer";
import { EventType } from "@Model/Emitter";
import { GLCanvas, GLCanvasOption } from "./GLCanvas";
import { GLContext } from "./GLContext";
import { Camera } from "./Camera";
import { Clock } from "@Model/Clock";

interface IRendererOwnParams {}

/**
 * 渲染器参数
 */
type IRendererParams = IRendererOwnParams & GLCanvasOption;

abstract class BasicRenderer<
    P extends IRendererParam = {},
    M extends IAnyObject = {},
    E extends Record<EventType, any> = {}
> extends AbstractRenderer<P, M & IRendererParams, E> {

    /**
	 * 渲染器参数
	 */
	public param: Partial<M & IRendererParams> = {};

    /**
	 * 使用的画布
	 */
    public canvas: GLCanvas;

    /**
     * 主相机
     */
    public camera: Camera;

    /**
     * 渲染时钟
     */
    protected clock: Clock;

    public constructor(canvas: HTMLCanvasElement, param: Partial<M & IRendererParams> = {}) {
		super();

		// 初始化参数
		this.param = {
			autoResize: param.autoResize ?? true,
			mouseEvent: param.autoResize ?? true,
			eventLog: param.eventLog ?? false,
			className: param.className ?? ""
		} as M & IRendererParams;
		
		// 实例化画布对象
		this.canvas = new GLCanvas(canvas, this.param);

        // 实例化摄像机
        this.camera = new Camera(this.canvas);

        // 尝试 webgl2
        this.gl = this.canvas.can.getContext("webgl2") as any;
        if (this.gl) {
            this.glVersion = 2;
            console.log("Render: Using WebGL2 :)");
        } else {

            // 尝试 WebGL1
            this.gl = this.canvas.can.getContext("webgl") as any;
            if (this.gl){
                this.glVersion = 1;
                console.log("Render: Using WebGL1 :(");
            }

            // 获取失败发出警告
            else {
                console.error("Render: Not supported WebGL!");
            }
        }

        // 开启深度测试
        this.gl.enable(this.gl.DEPTH_TEST);

        /**
         * 实例化时钟
         */
        this.clock = new Clock();
	}

    /**
     * 执行渲染
     */
    protected run() {
        this.clock.setFn(this.loop.bind(this));
        this.clock.run();
    }

    /**
     * 大小变化
     */
    protected resize() {
        this.loop(0);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 开启自动大小调整
     */
    protected autoResize() {
        this.canvas.on("resize", this.resize.bind(this));
    }

    /**
     * 清屏颜色
     */
    public cleanColor: [number, number, number, number] = [.1, .1, .1, 1.];

    /**
     * 清屏
     */
    public cleanCanvas(){
        this.gl.clearColor(
            this.cleanColor[0], this.cleanColor[1],
            this.cleanColor[2], this.cleanColor[3]
        );
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * GL 上下文
     */
    public gl: GLContext;

     /**
      * WebGL 版本
      */
    public glVersion: (0 | 1 | 2) = 0;

    /**
     * 初始化
     */
    abstract onLoad(): void;

    /**
     * 渲染器执行
     */
    abstract loop(dur: number): void;

}

export default BasicRenderer;
export { BasicRenderer, IRendererParams };