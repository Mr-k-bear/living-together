import { createContext } from "react";
import { Emitter } from "@Model/Emitter";
import { Model, ObjectID } from "@Model/Model";
import { Label } from "@Model/Label";
import { Range } from "@Model/Range";
import { Group } from "@Model/Group";
import { Archive } from "@Model/Archive";
import { AbstractRenderer } from "@Model/Renderer";
import { ClassicRenderer, MouseMod } from "@GLRender/ClassicRenderer";
import { Setting } from "./Setting";
import { I18N } from "@Component/Localization/Localization";
import { superConnectWithEvent, superConnect } from "./Context";
import { PopupController } from "./Popups";
import { Behavior } from "@Model/Behavior";
import { IParameter, IParamValue } from "@Model/Parameter";
import { Actuator } from "@Model/Actuator";

function randomColor(unNormal: boolean = false) {
    const color = [
        Math.random() * .8 + .2,
        Math.random() * .8 + .2,
        Math.random() * .8 + .2, 1
    ]
    if (unNormal) {
        color[0] = Math.round(color[0] * 255),
        color[1] = Math.round(color[1] * 255),
        color[2] = Math.round(color[2] * 255)
    }
    return color;
}

interface IStatusEvent {
    renderLoop: number;
    physicsLoop: number;
    mouseModChange: void;
    focusObjectChange: void;
    focusLabelChange: void;
    focusBehaviorChange: void;
    objectChange: void;
    rangeLabelChange: void;
    groupLabelChange: void;
    groupBehaviorChange: void;
    labelChange: void;
    rangeAttrChange: void;
    labelAttrChange: void;
    groupAttrChange: void;
    behaviorAttrChange: void;
    individualChange: void;
    behaviorChange: void;
    popupChange: void;
    actuatorStartChange: void;
}

class Status extends Emitter<IStatusEvent> {

    public setting: Setting = undefined as any;

    /**
     * 对象命名
     */
    public objectNameIndex = 1;
    public labelNameIndex = 1;

    /**
     * 渲染器
     */
    public renderer: AbstractRenderer = undefined as any;

    /**
     * 文件状态
     */
    public archive: Archive = new Archive();

    /**
     * 模型状态
     */
    public model: Model = new Model();

    /**
     * 执行器
     */
    public actuator: Actuator;

    /**
     * 弹窗
     */
    public popup: PopupController = new PopupController();

    /**
     * 焦点对象
     */
    public focusObject: Set<ObjectID> = new Set();

    /**
     * 焦点标签
     */
    public focusLabel?: Label;

    /**
     * 焦点行为
     */
    public focusBehavior?: Behavior;

    private drawTimer?: NodeJS.Timeout;

    private delayDraw = () => {
        this.drawTimer ? clearTimeout(this.drawTimer) : null;
        this.drawTimer = setTimeout(() => {
            this.model.draw();
            this.drawTimer = undefined;
        });
    }

    public constructor() {
        super();

        // 初始化执行器
        this.actuator = new Actuator(this.model);

        // 执行器开启事件
        this.actuator.on("startChange", () => { this.emit("actuatorStartChange") });

        // 循环事件
        this.actuator.on("loop", (t) => { this.emit("physicsLoop", t) });

        // 对象变化事件
        this.model.on("objectChange", () => this.emit("objectChange"));
        this.model.on("labelChange", () => this.emit("labelChange"));
        this.model.on("behaviorChange", () => this.emit("behaviorChange"));

        // 弹窗事件
        this.popup.on("popupChange", () => this.emit("popupChange"));

        // 对象变换时执行渲染，更新渲染器数据
        this.on("objectChange", this.delayDraw);
        this.model.on("individualChange", this.delayDraw);
        this.model.on("individualChange", () => {
            this.emit("individualChange");
        });

        // 当模型中的标签和对象改变时，更新全部行为参数中的受控对象
        const updateBehaviorParameter = () => {
            this.model.updateBehaviorParameter();
        }
        this.on("objectChange", updateBehaviorParameter);
        this.on("behaviorChange", updateBehaviorParameter);
        this.on("labelChange", updateBehaviorParameter);
        this.on("groupLabelChange", updateBehaviorParameter);
        this.on("rangeLabelChange", updateBehaviorParameter);
        this.on("behaviorAttrChange", updateBehaviorParameter);
    }

    public bindRenderer(renderer: AbstractRenderer) {
        this.renderer = renderer;
        this.renderer.on("loop", (t) => { this.emit("renderLoop", t) });
        this.model.bindRenderer(this.renderer);
    } 

    /**
     * 更新焦点对象
     */
    public setFocusObject(focusObject: Set<ObjectID>) {
        this.focusObject = focusObject;
        this.emit("focusObjectChange");
    }

    /**
     * 更新焦点标签
     */
    public setLabelObject(focusLabel?: Label) {
        this.focusLabel = focusLabel;
        this.emit("focusLabelChange");
    }

    /**
     * 更新焦点行为
     */
    public setBehaviorObject(focusBehavior?: Behavior) {
        this.focusBehavior = focusBehavior;
        this.emit("focusBehaviorChange");
    }

    /**
     * 修改范围属性
     */
    public changeRangeAttrib<K extends keyof Range>
    (id: ObjectID, key: K, val: Range[K]) {
        const range = this.model.getObjectById(id);
        if (range && range instanceof Range) {
            range[key] = val;
            this.emit("rangeAttrChange");
            this.model.draw();
        }
    }

    /**
     * 修改群属性
     */
    public changeGroupAttrib<K extends keyof Group>
    (id: ObjectID, key: K, val: Group[K]) {
        const group = this.model.getObjectById(id);
        if (group && group instanceof Group) {
            group[key] = val;
            this.emit("groupAttrChange");
            this.model.draw();
        }
    }

    /**
     * 修改群属性
     */
    public changeBehaviorAttrib<K extends IParameter, P extends keyof K | keyof Behavior<K>>
    (id: ObjectID, key: P, val: IParamValue<K[P]>, noParameter?: boolean) {
        const behavior = this.model.getBehaviorById(id);
        if (behavior) {
            if (noParameter) {
                behavior[key as keyof Behavior<K>] = val as never;
            } else {
                behavior.parameter[key] = val;
                behavior.parameterOption[key]?.onChange ?
                    behavior.parameterOption[key]?.onChange!(val) :
                    undefined;
            }
            this.emit("behaviorAttrChange");
        }
    }

    public addGroupBehavior(id: ObjectID, val: Behavior) {
        const group = this.model.getObjectById(id);
        if (group && group instanceof Group) {
            group.addBehavior(val);
            this.emit("groupBehaviorChange");
        }
    }

    public deleteGroupBehavior(id: ObjectID, val: Behavior) {
        const group = this.model.getObjectById(id);
        if (group && group instanceof Group) {
            group.deleteBehavior(val);
            this.emit("groupBehaviorChange");
        }
    }

    public addGroupLabel(id: ObjectID, val: Label) {
        const group = this.model.getObjectById(id);
        if (group && group instanceof Group) {
            group.addLabel(val);
            this.emit("groupLabelChange");
        }
    }

    public deleteGroupLabel(id: ObjectID, val: Label) {
        const group = this.model.getObjectById(id);
        if (group && group instanceof Group) {
            group.removeLabel(val);
            this.emit("groupLabelChange");
        }
    }

    public addRangeLabel(id: ObjectID, val: Label) {
        const range = this.model.getObjectById(id);
        if (range && range instanceof Range) {
            range.addLabel(val);
            this.emit("rangeLabelChange");
        }
    }

    public deleteRangeLabel(id: ObjectID, val: Label) {
        const range = this.model.getObjectById(id);
        if (range && range instanceof Range) {
            range.removeLabel(val);
            this.emit("rangeLabelChange");
        }
    }

    /**
     * 修改范围属性
     */
    public changeLabelAttrib<K extends keyof Label>
    (label: Label, key: K, val: Label[K]) {
        let findLabel: Label | undefined;
        for (let i = 0; i < this.model.labelPool.length; i++) {
            if (this.model.labelPool[i].equal(label)) {
                findLabel = this.model.labelPool[i];
                break;
            }
        }
        if (findLabel) {
            findLabel[key] = val;
            this.emit("labelAttrChange");
        }
    }

    /**
     * 鼠标工具状态
     */
    public mouseMod: MouseMod = MouseMod.Drag;

    public newGroup() {
        const group = this.model.addGroup();
        group.color = randomColor();
        group.displayName = I18N(this.setting.language, "Object.List.New.Group", {
            id: this.objectNameIndex.toString()
        });
        this.objectNameIndex ++;
        return group;
    }

    public newRange() {
        const range = this.model.addRange();
        range.color = randomColor();
        range.displayName = I18N(this.setting.language, "Object.List.New.Range", {
            id: this.objectNameIndex.toString()
        });
        this.objectNameIndex ++;
        return range;
    }

    public newLabel() {
        const label = this.model.addLabel(
            I18N(this.setting.language, "Object.List.New.Label", {
                id: this.labelNameIndex.toString()
            })
        );
        label.color = randomColor(true);
        this.labelNameIndex ++;
        return label;
    }

    public setMouseMod(mod: MouseMod) {
        this.mouseMod = mod;
        if (this.renderer instanceof ClassicRenderer) {
            this.renderer.mouseMod = mod;
            this.renderer.setMouseIcon();
        }
        this.emit("mouseModChange");
    }

}

interface IMixinStatusProps {
    status?: Status;
}

const StatusContext = createContext<Status>(new Status());

StatusContext.displayName = "Status";
const StatusProvider = StatusContext.Provider;
const StatusConsumer = StatusContext.Consumer;

/**
 * 修饰器
 */
const useStatus = superConnect<Status>(StatusConsumer, "status");

const useStatusWithEvent = superConnectWithEvent<Status, IStatusEvent>(StatusConsumer, "status");

export {
    Status, StatusContext, useStatus, useStatusWithEvent, randomColor,
    IMixinStatusProps, StatusProvider, StatusConsumer
};