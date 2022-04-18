import { LabelObject } from "@Model/Label"
import { v4 as uuid } from "uuid";
import type { IAnyObject, Model } from "@Model/Model";
import type { ObjectID } from "@Model/Model";

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
     * 渲染数据
     */
    public renderParameter: IAnyObject = {};

    /**
     * 构造器
     */
    public constructor(model: Model) {
        super();
        this.model = model;
        this.id = uuid();
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
    public equal(obj?: CtrlObject): boolean {
        return this === obj || this.id === obj?.id;
    }

    /**
     * 标记对象被删除
     */
    public markDelete() {
        this.deleteFlag = true;
    };

    /**
     * 删除标记
     */
    private deleteFlag: boolean = false;

    /**
     * 检测是否被删除
     */
    public testDelete() {
        for (let i = 0; i < this.model.objectPool.length; i++) {
            if (this.model.objectPool[i].equal(this)) {
                this.deleteFlag = false;
                return;
            }
        }
        this.deleteFlag = true;
    }

    /**
     * 是否被删除
     */
    public isDeleted(): boolean {
        return this.deleteFlag;
    }
}

export default CtrlObject;
export { CtrlObject };