import { EventType } from "@Model/Emitter";
import { GLContextObject } from "./GLContext";
import { GLShader } from "./GLShader";

abstract class DisplayObject<
    S extends GLShader = GLShader,
    E extends Record<EventType, any> = {}
> extends GLContextObject<E> {

    /**
     * 是否开启绘制
     */
    public isDraw: boolean = true;

    /**
     * 绘制帧数
     */
    public drawEmptyFrame: number = 0;

    /**
     * 绑定的 shader
     */
    protected shader: S = undefined as any;

    /**
     * 绑定着色器
     */
    public bindShader(shader: S) {
        this.shader = shader;
        return this;
    }

    /**
     * 绘制函数
     */
    abstract draw(): void;

    /**
     * 销毁时调用
     * 用于释放显存
     */
    abstract clean(): void;
}

export { DisplayObject }
export default DisplayObject;