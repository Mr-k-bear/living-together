import { LabelObject } from "./Label"
import type { Model } from "./Model";
import type { ObjectID } from "./Renderer";

/**
 * 可控对象
 */
class CtrlObject extends LabelObject {

    /**
     * 显示名称
     */
    public displayName: string = "";

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

    /**
     * 判断是否为相同对象
     */
    public equal(obj: CtrlObject): boolean {
        return this === obj || this.id === obj.id;
    }


    /**
     * 删除标记
     */
    private deleteFlag: boolean = false;

     /**
      * 是否被删除
      */
    public isDeleted(): boolean {
        if (this.deleteFlag) return true;
        for (let i = 0; i < this.model.objectPool.length; i++) {
            if (this.model.objectPool[i].equal(this)) return false;
        }
        this.deleteFlag = true;
        return true;
    }
}

export default CtrlObject;
export { CtrlObject };