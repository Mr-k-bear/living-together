import type { Model } from "./Model";
import { ObjectID } from "./Renderer";

/**
 * 数据标签
 */
class Label {

    /**
     * 是否为内置标签
     */
    public isBuildIn: boolean = false;
    
    /**
     * 唯一标识符
     */
    public id: ObjectID;

    /**
     * 用户定义的名称
     */
    public name: string = "";

    /**
     * CSS 颜色
     */
    public color: number[] = [0, 0, 0];

    /**
     * 所属模型
     */
    public model: Model;

    /**
     * 构造器
     * @param id 标签 ID
     * @param name 用户定义的名称
     */
    public constructor(model: Model, id: ObjectID, name?: string) {
        this.model = model;
        this.id = id;
        this.name = name ?? this.name;
    }

    /**
     * 判断是否为相同标签
     */
    public equal(label: Label): boolean {
        if (this.isDeleted() || label.isDeleted()) return false;
        return this === label || this.id === label.id;
    }

    /**
     * 删除标记
     */
    private deleteFlag: boolean = false;

    /**
     * 测试是否被删除
     */
    public testDelete() {
        for (let i = 0; i < this.model.labelPool.length; i++) {
            if (this.model.labelPool[i].equal(this)) return false;
        }
        this.deleteFlag = true;
        return true;
    }

    /**
     * 是否被删除
     */
    public isDeleted(): boolean {
        if (this.isBuildIn) return false;
        if (this.deleteFlag) return true;
        return false;
    }

    /**
     * 设置为内置标签
     */
    public setBuildInLabel(): this {
        this.isBuildIn = true;
        return this;
    }
}

/**
 * 可以被打标签的数据
 */
class LabelObject {

    /**
     * 标签集合
     */
    private labels: Label[] = [];

    /**
     * 获取全部 Label
     */
    public allLabels(): Label[] {
        return this.labels.concat([]);
    }

    /**
     * 添加标签
     */
    public addLabel(label: Label): this {
        this.labels.push(label);
        return this;
    }

    /**
     * 移除标签
     */
    public removeLabel(label: Label): this {
        this.labels = this.labels.filter((localLabel) => {
            return !localLabel.equal(label);
        });
        return this;
    }

    /**
     * 是否存在标签
     */
    public hasLabel(label: Label): boolean {
        if (label.isDeleted()) return false;
        let has = false;
        this.labels.forEach((localLabel) => {
            if (!localLabel.isDeleted() && localLabel.equal(label)) has = true;
        });
        return has;
    }
}

export { Label, LabelObject };