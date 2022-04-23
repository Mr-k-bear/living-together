import { Emitter, EventType } from "@Model/Emitter";
import { v4 as uuid } from "uuid";
import type { Individual } from "@Model/Individual";
import type { Group } from "@Model/Group";
import type { Model } from "@Model/Model";
import {
    archiveObject2Parameter,
    getDefaultValue, IArchiveParameterValue, IArchiveParseFn,
    IParameter, IParameterOption, IParameterValue, parameter2ArchiveObject
} from "@Model/Parameter";

/**
 * 行为构造函数类型
 */
type IBehaviorConstructor<
    P extends IParameter = {},
    E extends Record<EventType, any> = {}
> = new (parameter: IParameterValue<P>) => Behavior<P, E>;

type IAnyBehavior = Behavior<any, any>;
type IAnyBehaviorRecorder = BehaviorRecorder<any, any>;

type Language = "ZH_CN" | "EN_US";

/**
 * 行为的基础信息
 */
class BehaviorInfo<E extends Record<EventType, any> = {}> extends Emitter<E> {

    /**
     * 图标名字
     */
    public iconName: string = ""

    /**
     * 行为 ID
     */
    public behaviorId: string = "";
        
    /**
     * 行为名称
     */
    public behaviorName: string = "";

    /**
     * 行为描述
     */
    public describe: string = "";

    /**
     * 类别
     */
    public category: string = "";

    /**
     * 提条列表
     */
    public terms: Record<string, Record<Language | string, string>> = {};

    /**
     * 获取词条翻译
     */
    public getTerms(key: string, language?: Language | string): string {
        if (key[0] === "$" && this.terms[key]) {
            let res: string = "";
            if (language) {
                res = this.terms[key][language];
            } else {
                res = this.terms[key]["EN_US"];
            }
            if (res) {
                return res;
            }
        }
        return key;
    }
}

class BehaviorRecorder<
    P extends IParameter = {},
    E extends Record<EventType, any> = {}
> extends BehaviorInfo<{}> {

    /**
     * 行为类型
     */
    public behavior: IBehaviorConstructor<P, E>;

    /**
     * 行为实例
     */
    public behaviorInstance: Behavior<P, E>;

    /**
     * 对象参数列表
     */
    public parameterOption: IParameterOption<P>;

    /**
     * 创建一个新的行为实例
     */
    public new(): Behavior<P, E> {
        return new this.behavior(getDefaultValue(this.parameterOption));
    }

    public constructor(behavior: IBehaviorConstructor<P, E>) {
        super();
        this.behavior = behavior;
        this.behaviorInstance = new this.behavior({} as any);
        this.parameterOption = this.behaviorInstance.parameterOption;
        this.iconName = this.behaviorInstance.iconName;
        this.behaviorId = this.behaviorInstance.behaviorId;
        this.behaviorName = this.behaviorInstance.behaviorName;
        this.describe = this.behaviorInstance.describe;
        this.category = this.behaviorInstance.category;
        this.terms = this.behaviorInstance.terms;
    }
}

interface IArchiveBehavior {
    behaviorId: string;
    name: string;
    id: string;
    color: number[];
    priority: number;
    currentGroupKey: string[];
    deleteFlag: boolean;
    parameter: IArchiveParameterValue<IParameter>;
}

/**
 * 群体的某种行为
 */
class Behavior<
    P extends IParameter = {},
    E extends Record<EventType, any> = {}
> extends BehaviorInfo<E> {

    /**
     * 用户自定义名字
     */
    public name: string = "";

    /**
     * 实例 ID
     */
    public id: string = "";

    /**
     * 颜色
     */
    public color: number[] = [0, 0, 0];

    /**
     * 优先级
     * 值越大执行顺序越靠后
     */
    public priority: number = 0;

    /**
     * 行为参数
     */
    public parameter: IParameterValue<P>;

    /**
     * 指定当前群的 Key
     */
    public currentGroupKey: Array<keyof P> = [];

    /**
     * 对象参数列表
     */
    public parameterOption: IParameterOption<P> = {} as any;

    public constructor(parameter: IParameterValue<P>) {
        super();
        this.id = uuid();
        this.parameter = parameter;
    }

    /**
     * 相等校验
     */
    public equal(behavior: Behavior<any, any>): boolean {
        return this === behavior || this.id === behavior.id;
    };

    /**
     * 删除标记
     */
    private deleteFlag: boolean = false;

    /**
     * 标记对象被删除
     */
    public markDelete() {
        this.deleteFlag = true;
    };

    /**
     * 是否被删除
     */
    public isDeleted(): boolean {
        return this.deleteFlag;
    }

    public toArchive(): IArchiveBehavior {
        return {
            behaviorId: this.behaviorId,
            name: this.name,
            id: this.id,
            color: this.color.concat([]),
            priority: this.priority,
            currentGroupKey: this.currentGroupKey.concat([]) as any,
            deleteFlag: this.deleteFlag,
            parameter: parameter2ArchiveObject(
                this.parameter, this.parameterOption
            )
        };
    }

    public fromArchive(archive: IArchiveBehavior, paster: IArchiveParseFn): void {
        this.name = archive.name,
        this.id = archive.id,
        this.color = archive.color.concat([]),
        this.priority = archive.priority,
        this.currentGroupKey = archive.currentGroupKey.concat([]) as any,
        this.deleteFlag = archive.deleteFlag,
        this.parameter = archiveObject2Parameter(
            archive.parameter, paster
        ) as any;
    }

    /**
     * 加载时调用
     */
    public load(model: Model): void {}

    /**
     * 卸载时调用
     */
    public unload(model: Model): void {}

    /**
     * 挂载时调用
     */
    public mount(group: Group, model: Model): void {}

     /**
      * 挂载时调用
      */
    public unmount(group: Group, model: Model): void {}

    /**
     * 全部影响作用前
     * @param individual 影响个体
     * @param group 影响组
     * @param model 模型
     * @param t 经过时间
     */
    public effect?: (individual: Individual, group: Group, model: Model, t: number) => void;

    /**
     * 作用影响于个体
     * @param individual 影响个体
     * @param group 影响组
     * @param model 模型
     * @param t 经过时间
     */
    public afterEffect?: (individual: Individual, group: Group, model: Model, t: number) => void;

    /**
     * 全部影响作用后
     * @param individual 影响个体
     * @param group 影响组
     * @param model 模型
     * @param t 经过时间
     */
    public finalEffect?: (individual: Individual, group: Group, model: Model, t: number) => void;

}

type IRenderBehavior = BehaviorInfo | Behavior;

export {
    Behavior, BehaviorRecorder, IAnyBehavior, IAnyBehaviorRecorder,
    BehaviorInfo, IRenderBehavior, IArchiveBehavior
};