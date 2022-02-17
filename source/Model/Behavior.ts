import { IAnyObject } from "./Renderer";
import { Emitter, EventType } from "./Emitter";
import type { Individual } from "./Individual";
import type { Group } from "./Group";

/**
 * 群体的某种行为
 */
abstract class Behavior<
    P extends IAnyObject, E extends Record<EventType, any>
> extends Emitter<E> {

    /**
     * 行为 ID
     */
    abstract id: string;
    
    /**
     * 行为名称
     */
    abstract name: string;

    /**
     * 行为描述
     */
    public describe?: string = "";

    /**
     * 优先级
     * 值越大执行顺序越靠后
     */
    public priority?: number = 0;

    /**
     * 行为参数
     */
    abstract parameter?: P;

    /**
     * 作用影响于个体
     * @param individual 影响个体
     * @param group 影响组
     * @param t 经过时间
     */
    abstract effect(individual: Individual, group: Group, t: number): void;

}

export { Behavior };
export default { Behavior };