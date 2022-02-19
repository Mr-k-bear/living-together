/**
 * 数据标签
 */
class Label {
    
    /**
     * 唯一标识符
     */
    public id: string;

    /**
     * 用户定义的名称
     */
    public name?: string;

    /**
     * CSS 颜色
     */
    public color?: string;

    /**
     * 构造器
     * @param id 标签 ID
     * @param name 用户定义的名称
     */
    public constructor(id: string, name?: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * 判断是否为相同标签
     */
    public equal(label: Label): boolean {
        return this === label || this.id === label.id;
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
        let has = false;
        this.labels.forEach((localLabel) => {
            if (localLabel.equal(label)) has = true;
        });
        return has;
    }
}

export { Label, LabelObject };