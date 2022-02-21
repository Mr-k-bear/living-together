import { LabelObject } from "./Label"
import type { Model } from "./Model";
import type { ObjectID } from "./Renderer";

/**
 * 可控对象
 */
class CtrlObject extends LabelObject {

    /**
     * 颜色
     */
    public color: number[] = [.5, .5, .5];

    /**
     * 是否显示
     */
    public display: boolean = true;

    /**
     * 是否更新
     */
    public update: boolean = true;

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

    /**
     * 移除
     */
    public delete() {
        this.model.deleteObject([this]);
    }
}

export default CtrlObject;
export { CtrlObject };