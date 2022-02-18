
import { Individual } from "./Individual";
import { Group } from "./Group";
import { Emitter, EventType, EventMixin } from "./Emitter";

/**
 * 模型 全局控制器
 */
class Model extends Emitter<{}> {

}

export {
    Individual,
    Group,
    Emitter,
    EventType,
    EventMixin,
    Model
}