import { Label } from "@Model/Label";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { IParamValue } from "@Model/Parameter";
import { Individual } from "@Model/Individual";
import { CtrlObject } from "@Model/CtrlObject";
import { Emitter, EventType, EventMixin } from "@Model/Emitter";
import { AbstractRenderer } from "@Model/Renderer";
import { Behavior, IAnyBehavior, IAnyBehaviorRecorder } from "@Model/Behavior";

/**
 * 对象标识符
 */
type ObjectID = string;

/**
 * 任意类型对象
 */
type IAnyObject = Record<string, any>;

type ModelEvent = {
    labelChange: Label[];
    objectChange: CtrlObject[];
    individualChange: Group;
    behaviorChange: IAnyBehavior;
};

/**
 * 模型 全局控制器
 */
class Model extends Emitter<ModelEvent> {

    /**
     * 下一个需要分配的 ID
     */
    public idIndex: number = 1;
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
     * 内置标签-全部群标签
     */
    public currentGroupLabel = new Label(this, "CurrentGroupLabel").setBuildInLabel();

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
    public behaviorPool: IAnyBehavior[] = [];

    /**
     * 添加一个行为
     */
    public addBehavior<B extends IAnyBehaviorRecorder>(recorder: B): B["behaviorInstance"] {
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
    public getBehaviorById(id: ObjectID): IAnyBehavior | undefined {
        for (let i = 0; i < this.behaviorPool.length; i++) {
            if (this.behaviorPool[i].id.toString() === id.toString()) {
                return this.behaviorPool[i];
            }
        }
    }

    /**
     * 更新全部行为的参数
     */
    public updateBehaviorParameter() {
        for (let i = 0; i < this.behaviorPool.length; i++) {
            const behavior = this.behaviorPool[i];
            behavior.currentGroupKey = [];
            
            for (let key in behavior.parameterOption) {
                switch (behavior.parameterOption[key].type) {

                    case "R":
                        const dataR: IParamValue<"R"> = behavior.parameter[key];
                        dataR.objects = undefined;
                        
                        if (dataR.picker instanceof Range && !dataR.picker.isDeleted()) {
                            dataR.objects = dataR.picker;
                        }
                        break;

                    case "CG":
                    case "G":
                        const dataG: IParamValue<"CG"> = behavior.parameter[key];
                        dataG.objects = undefined;

                        if (dataG.picker instanceof Label && dataG.picker.id === this.currentGroupLabel.id) {
                            behavior.currentGroupKey.push(key);
                            dataG.objects = undefined;
                        }
                        
                        else if (dataG.picker instanceof Group && !dataG.picker.isDeleted()) {
                            dataG.objects = dataG.picker;
                        }
                        break;

                    case "LR":
                        const dataLR: IParamValue<"LR"> = behavior.parameter[key];
                        dataLR.objects = [];

                        if (dataLR.picker instanceof Range && !dataLR.picker.isDeleted()) {
                            dataLR.objects.push(dataLR.picker);
                        }

                        if (dataLR.picker instanceof Label && !dataLR.picker.isDeleted()) {
                            dataLR.objects = this.getObjectByLabel(dataLR.picker).filter((obj) => {
                                return obj instanceof Range;
                            }) as any;
                        }
                        break;

                    case "CLG":
                    case "LG":
                        const dataLG: IParamValue<"CLG"> = behavior.parameter[key];
                        dataLG.objects = [];

                        if (dataLG.picker instanceof Group && !dataLG.picker.isDeleted()) {
                            dataLG.objects.push(dataLG.picker);
                        }

                        if (dataLG.picker instanceof Label && !dataLG.picker.isDeleted()) {

                            if (dataLG.picker.id === this.currentGroupLabel.id) {
                                behavior.currentGroupKey.push(key);
                                dataLG.objects = [];

                            } else {
                                dataLG.objects = this.getObjectByLabel(dataLG.picker).filter((obj) => {
                                    return obj instanceof Group;
                                }) as any;
                            }
                        }
                        break;
                }
            }
        }
    }

    /**
     * 搜索并删除一个 Behavior
     * @param name 搜索值
     */
    public deleteBehavior(name: IAnyBehavior | ObjectID) {
        let deletedBehavior: IAnyBehavior | undefined;
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
                object.runner(t, "effect");
            }
        }

        // 第二轮更新
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object instanceof Group && object.update) {
                object.runner(t, "afterEffect");
            }
        }

        // 第三轮更新
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            if (object instanceof Group && object.update) {
                object.runner(t, "finalEffect");
            }
        }

        this.draw();
    }

    public draw() {

        // 清除全部渲染状态
        this.renderer.clean();

        // 渲染
        for (let i = 0; i < this.objectPool.length; i++) {
            let object = this.objectPool[i];
            object.renderParameter.color = object.color;
            if (object.display && object instanceof Group) {
                this.renderer.points(object.id, object.exportPositionData(), object.renderParameter);
            }
            if (object.display && object instanceof Range) {
                this.renderer.cube(object.id, object.position, object.radius, object.renderParameter);
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
    ObjectID,
    IAnyObject
}