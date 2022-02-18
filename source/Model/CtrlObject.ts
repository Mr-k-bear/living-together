import { LabelObject } from "./Label"
import type { Model } from "./Model";
import type { ObjectID } from "./Renderer";

/**
 * 可控对象
 */
class CtrlObject extends LabelObject {

    /**
     * 唯一标识符
     */
    public id: ObjectID;
    
    /**
     * 控制模型
     */
    protected model: Model;

    /**
     * 构造器
     */
    public constructor(model: Model, id: ObjectID) {
        super();
        this.model = model;
        this.id = id;
    }
}

export default CtrlObject;
export { CtrlObject };