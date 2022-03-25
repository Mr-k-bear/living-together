import { Individual } from "./Individual";
import { Group } from "./Group";
import { Range } from "./Range";
import { Emitter, EventType, EventMixin } from "./Emitter";
import { CtrlObject } from "./CtrlObject";
import { ObjectID, AbstractRenderer } from "./Renderer";
import { Label } from "./Label";
import { Behavior, BehaviorRecorder } from "./Behavior";

type ModelEvent = {
    loop: number;
    labelChange: Label[];
    objectChange: CtrlObject[];
    individualChange: Group;
    behaviorChange: Behavior;
};

/**
 * 模型 全局控制器
 */
class Model extends Emitter<ModelEvent> {

    /**
     * 下一个需要分配的 ID
     */
    private idIndex: number = 1;
    public nextId(label: string = "U"): string {
        return `${label}-${this.idIndex ++}`;
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
     * 内置标签-全部范围标签
     */
    public allRangeLabel = new Label(this, "AllRange").setBuildInLabel();

    /**
     * 内置标签-全部群标签
     */
    public allGroupLabel = new Label(this, "AllGroup").setBuildInLabel();

    /**
     * 添加标签
     */
    public addLabel(name: string): Label {
        console.log(`Model: Creat label with id ${this.idIndex}`);
        let label = new Label(this, this.nextId("L"), name);
        this.labelPool.push(label);
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
            deletedLabel.testDelete();
            console.log(`Model: Delete label ${deletedLabel.name ?? deletedLabel.id}`);
            this.emit("labelChange", this.labelPool);
        }
    }

    /**
     * 通过标签获取指定类型的对象
     * @param label 标签
     */
    public getObjectByLabel(label: Label): CtrlObject[] {

        if (label.isDeleted()) return [];

        const res: CtrlObject[] = [];
        for (let i = 0; i < this.objectPool.length; i++) {

            if (label.equal(this.allGroupLabel) && this.objectPool[i] instanceof Group) {
                res.push(this.objectPool[i]);
            }

            else if (label.equal(this.allRangeLabel) && this.objectPool[i] instanceof Range) {
                res.push(this.objectPool[i]);
            }

            else if (this.objectPool[i].hasLabel(label)) {
                res.push(this.objectPool[i]);
            }
        }
        return res;
    }

    /**
     * 添加组
     */
    public addGroup(): Group {
        console.log(`Model: Creat group with id ${this.idIndex}`);
        let group = new Group(this, this.nextId("G"));
        this.objectPool.push(group);
        this.emit("objectChange", this.objectPool);
        return group;
    }

    /**
     * 添加范围
     */
    public addRange(): Range {
        console.log(`Model: Creat range with id ${this.idIndex}`);
        let range = new Range(this, this.nextId("R"));
        this.objectPool.push(range);
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
                currentObject.markDelete();
                return false;
            } else {
                return true;
            }
        });

        if (deletedObject.length) {
            console.log(`Model: Delete object ${deletedObject.map((object) => object.id).join(", ")}`);
            this.emit("objectChange", this.objectPool);
        }
        return deletedObject;
    }

    /**
     * 行为池
     */
    public behaviorPool: Behavior<any, any>[] = [];

    /**
     * 添加一个行为
     */
    public addBehavior<B extends Behavior<any, any>>(recorder: BehaviorRecorder<B>): B {
        let behavior = recorder.new();
        behavior.load(this);
        this.behaviorPool.push(behavior);
        console.log(`Model: Add ${behavior.behaviorName} behavior ${behavior.id}`);
        this.emit("behaviorChange", behavior);
        return behavior;
    };

    /**
     * 通过 ID 获取行为
     */
    public getBehaviorById(id: ObjectID): Behavior<any, any> | undefined {
        for (let i = 0; i < this.behaviorPool.length; i++) {
            if (this.behaviorPool[i].id.toString() === id.toString()) {
                return this.behaviorPool[i];
            }
        }
    }

    /**
     * 搜索并删除一个 Behavior
     * @param name 搜索值
     */
    public deleteBehavior(name: Behavior<any, any> | ObjectID) {
        let deletedBehavior: Behavior<any, any> | undefined;
        let index = 0;

        for (let i = 0; i < this.behaviorPool.length; i++) {
            if (name instanceof Behavior) {
                if (this.behaviorPool[i].equal(name)) {
                    deletedBehavior = this.behaviorPool[i];
                    index = i;
                }
            } else if (name === this.behaviorPool[i].id) {
                deletedBehavior = this.behaviorPool[i];
                index = i;
            }
        }

        if (deletedBehavior) {
            this.behaviorPool.splice(index, 1);
            deletedBehavior.unload(this);
            deletedBehavior.markDelete();
            console.log(`Model: Delete behavior ${deletedBehavior.name ?? deletedBehavior.id}`);
            this.emit("behaviorChange", deletedBehavior);
        }
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