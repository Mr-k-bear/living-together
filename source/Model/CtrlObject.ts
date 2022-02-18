import { LabelObject } from "./Label"
import type { Model } from "./Model";

/**
 * 可控对象
 */
class CtrlObject extends LabelObject {
    
    /**
     * 控制模型
     */
    protected model: Model;

    /**
     * 构造器
     */
    public constructor(model: Model) {
        super();
        this.model = model;
    }
}

export default CtrlObject;
export { CtrlObject };