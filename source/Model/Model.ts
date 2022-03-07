
import { Individual } from "./Individual";
import { Group } from "./Group";
import { Range } from "./Range";
import { Emitter, EventType, EventMixin } from "./Emitter";
import { CtrlObject } from "./CtrlObject";
import { ObjectID, AbstractRenderer } from "./Renderer";
import { Label } from "./Label";

type ModelEvent = {
    loop: number;
    groupAdd: Group;
    rangeAdd: Range;
    labelAdd: Label;
    labelDelete: Label;
    labelChange: Label[];
    objectAdd: CtrlObject;
    objectDelete: CtrlObject[];
    objectChange: CtrlObject[];
};

/**
 * 模型 全局控制器
 */
class Model extends Emitter<ModelEvent> {

    /**
     * 下一个需要分配的 ID
     */
    private idIndex: number = 1;
    public get nextId(): number {
        return this.idIndex ++;
    }

    /**
     * 对象列表
     */
    public objectPool: CtrlObject[] = [];

    public getObjectById(id: ObjectID): CtrlObject | undefined {
        for (let i = 0; i < this.objectPool.length; i++) {
            if (this.objectPool[i].id.toString() === id.toString()) {
                return this.objectPool[i];
            }
        }
    }

    /**
     * 标签列表
     */
    public labelPool: Label[] = [];

    /**
     * 添加标签
     */
    public addLabel(name: string): Label {
        console.log(`Model: Creat label with id ${this.idIndex}`);
        let label = new Label(this, this.nextId, name);
        this.labelPool.push(label);
        this.emit("labelAdd", label);
        this.emit("labelChange", this.labelPool);
        return label;
    }

    /**
     * 搜索并删除一个 Label
     * @param name 搜索值
     */
    public deleteLabel(name: Label | ObjectID) {
        let deletedLabel: Label | undefined;
        let index = 0;

        for (let i = 0; i < this.labelPool.length; i++) {
            if (name instanceof Label) {
                if (this.labelPool[i].equal(name)) {
                    deletedLabel = this.labelPool[i];
                    index = i;
                }
            } else if (name === this.labelPool[i].id) {
                deletedLabel = this.labelPool[i];
                index = i;
            }
        }

        if (deletedLabel) {
            this.labelPool.splice(index, 1);
            console.log(`Model: Delete label ${deletedLabel.name ?? deletedLabel.id}`);
            this.emit("labelDelete", deletedLabel);
            this.emit("labelChange", this.labelPool);
        }
    }

    /**
     * 添加组
     */
    public addGroup(): Group {
        console.log(`Model: Creat group with id ${this.idIndex}`);
        let group = new Group(this, this.nextId);
        this.objectPool.push(group);
        this.emit("groupAdd", group);
        this.emit("objectAdd", group);
        this.emit("objectChange", this.objectPool);
        return group;
    }

    /**
     * 添加范围
     */
    public addRange(): Range {
        console.log(`Model: Creat range with id ${this.idIndex}`);
        let range = new Range(this, this.nextId);
        this.objectPool.push(range);
        this.emit("rangeAdd", range);
        this.emit("objectAdd", range);
        this.emit("objectChange", this.objectPool);
        return range;
    }

    /**
     * 删除对象
     */
    public deleteObject(object: CtrlObject[] | ObjectID[]): CtrlObject[] {
        let deletedObject: CtrlObject[] = [];
        this.objectPool = this.objectPool.filter((currentObject) => {
            let needDeleted: boolean = false;

            for (let i = 0; i < object.length; i++) {
                if (object[i] instanceof CtrlObject) {
                    if (object[i] === currentObject) {
                        needDeleted = true;
                    }
                } else {
                    if (object[i] == currentObject.id) {
                        needDeleted = true;
                    }
                }
            }

            if (needDeleted) {
                deletedObject.push(currentObject);
                return false;
            } else {
                return true;
            }
        });

        if (deletedObject.length) {
            console.log(`Model: Delete object ${deletedObject.map((object) => object.id).join(", ")}`);
            this.emit("objectDelete", deletedObject);
            this.emit("objectChange", this.objectPool);
        }
        return deletedObject;
    }

    /**
     * 渲染器
     */
    public renderer: AbstractRenderer = undefined as any;

    /**
     * 绑定渲染器
     * @param renderer 渲染器
     */
    public bindRenderer(renderer: AbstractRenderer): this {
        this.renderer = renderer;
        return this;
    }

    /**
     * 更新渲染数据
     */
    public update(t: number) {

        // 第一轮更新
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object instanceof Group && object.update) {
                object.runner(t, "beforeEffect");
            }
        }

        // 第二轮更新
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object instanceof Group && object.update) {
                object.runner(t, "effect");
            }
        }

        // 第三轮更新
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object instanceof Group && object.update) {
                object.runner(t, "afterEffect");
            }
        }

        this.draw();

        this.emit("loop", t);
    }

    public draw() {

        // 清除全部渲染状态
        this.renderer.clean();

        // 渲染
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object.display && object instanceof Group) {
                this.renderer.points(object.id, object.exportPositionData(), {
                    color: object.color,
                    size: object.size
                } as any);
            }
            if (object.display && object instanceof Range) {
                this.renderer.cube(object.id, object.position, {
                    color: object.color,
                    radius: object.radius
                } as any);
            }
        }
    }
}

export {
    Individual,
    Group,
    Emitter,
    EventType,
    EventMixin,
    Model,
    CtrlObject,
    ObjectID
}