import { EventType } from "@Model/Emitter";
import { GLContextObject } from "./GLContext";

abstract class DisplayObject<
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
}

export { DisplayObject }
export default DisplayObject;