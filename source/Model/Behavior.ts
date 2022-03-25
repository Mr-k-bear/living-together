import { IAnyObject } from "./Renderer";
import { Emitter, EventType } from "./Emitter";
import type { Individual } from "./Individual";
import type { Group } from "./Group";
import type { Model } from "./Model";
import type { Range } from "./Range";
import type { Label } from "./Label";

/**
 * 行为构造函数类型
 */
type IBehaviorConstructor<B extends Behavior<any, any>> =
    new (id: string, parameter: IBehaviorParameterValue<B["parameterOption"]>) => B;

/**
 * 参数类型
 */
type IMapBasicParamTypeKeyToType = {
    "number": number;
    "string": string;
    "boolean": boolean;
}

type IMapObjectParamTypeKeyToType = {
    "R"?: Range;
    "G"?: Group;
    "GR"?: Group | Range;
    "LR"?: Label | Range;
    "LG"?: Label | Group;
    "LGR"?: Label | Group | Range;
}

type IMapVectorParamTypeKeyToType = {
    "vec": number[];
}

/**
 * 参数类型映射
 */
type AllMapType = IMapBasicParamTypeKeyToType & IMapObjectParamTypeKeyToType & IMapVectorParamTypeKeyToType;
type IParamType = keyof AllMapType;
type IObjectType = keyof IMapObjectParamTypeKeyToType;
type IVectorType = keyof IMapVectorParamTypeKeyToType;
type IParamValue<K extends IParamType> = AllMapType[K];



/**
 * 特殊对象类型判定
 */
const objectTypeListEnumSet = new Set<IParamType>(["R", "G", "GR", "LR", "LG", "LGR"]);

/**
 * 对象断言表达式
 */
function isObjectType(key: IParamType): key is IVectorType {
    return objectTypeListEnumSet.has(key);
}

/**
 * 向量断言表达式
 */
function isVectorType(key: IParamType): key is IObjectType {
    return key === "vec";
}

/**
 * 模型参数类型
 */
interface IBehaviorParameterOptionItem<T extends IParamType = IParamType> {

    /**
     * 参数类型
     */
    type: T;

    /**
     * 参数默认值
     */
    defaultValue?: IParamValue<T>;

    /**
     * 数值变化回调
     */
    onChange?: (value: IParamValue<T>) => any;

    /**
     * 名字
     */
    name: string;

    /**
     * 字符长度
     */
    stringLength?: number;

    /**
     * 数字步长
     */
    numberStep?: number;

    /**
     * 最大值最小值
     */
    numberMax?: number;
    numberMin?: number;

    /**
     * 图标名字
     */
    iconName?: string;
}

/**
 * 参数键值类型
 */
type IBehaviorParameterValueItem<P extends IBehaviorParameterOptionItem> = IParamValue<P["type"]>;

/**
 * 参数类型列表
 */
interface IBehaviorParameterOption {
    [x: string]: IBehaviorParameterOptionItem;
}

/**
 * 参数类型列表映射到参数对象
 */
type IBehaviorParameterValue<P extends IBehaviorParameterOption> = {
    [x in keyof P]: IBehaviorParameterValueItem<P[x]>
}


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
    public describe?: string = "";
}

class BehaviorRecorder<
    B extends Behavior<any, any>
> extends BehaviorInfo {

    /**
     * 命名序号
     */
    public nameIndex: number = 0;

    /**
     * 获取下一个 ID
     */
    public getNextId() {
        return `B-${this.behaviorName}-${this.nameIndex ++}`;
    }

    /**
     * 行为类型
     */
    public behavior: IBehaviorConstructor<B>;

    /**
     * 行为实例
     */
    public behaviorInstance: B;

    /**
     * 对象参数列表
     */
    public parameterOption: B["parameterOption"];

    /**
     * 获取参数列表的默认值
     */
    public getDefaultValue(): IBehaviorParameterValue<B["parameterOption"]> {
        let defaultObj = {} as IBehaviorParameterValue<B["parameterOption"]>;
        for (let key in this.parameterOption) {
            let defaultVal = this.parameterOption[key].defaultValue;
            
            defaultObj[key] = defaultVal as any;
            if (defaultObj[key] === undefined) {

                switch (this.parameterOption[key].type) {
                    case "string":
                        defaultObj[key] = "" as any;
                        break;

                    case "number":
                        defaultObj[key] = 0 as any;
                        break;

                    case "boolean":
                        defaultObj[key] = false as any;
                        break;

                    case "vec":
                        defaultObj[key] = [0, 0, 0] as any;
                        break;
                }
            }
        }
        return defaultObj;
    }

    /**
     * 创建一个新的行为实例
     */
    public new(): B {
        return new this.behavior(this.getNextId(), this.getDefaultValue());
    }

    public constructor(behavior: IBehaviorConstructor<B>) {
        super();
        this.behavior = behavior;
        this.behaviorInstance = new this.behavior(this.getNextId(), {} as any);
        this.parameterOption = this.behaviorInstance.parameterOption;
        this.iconName = this.behaviorInstance.iconName;
        this.behaviorId = this.behaviorInstance.behaviorId;
        this.behaviorName = this.behaviorInstance.behaviorName;
        this.describe = this.behaviorInstance.describe;
    }
}

/**
 * 群体的某种行为
 */
class Behavior<
    P extends IBehaviorParameterOption = {},
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
     * 优先级
     * 值越大执行顺序越靠后
     */
    public priority: number = 0;

    /**
     * 行为参数
     */
    public parameter: IBehaviorParameterValue<P>;

    /**
     * 对象参数列表
     */
    public parameterOption: P = {} as any;

    public constructor(id: string, parameter: IBehaviorParameterValue<P>) {
        super();
        this.id = id;
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
    public beforeEffect(individual: Individual, group: Group, model: Model, t: number): void {};

    /**
     * 作用影响于个体
     * @param individual 影响个体
     * @param group 影响组
     * @param model 模型
     * @param t 经过时间
     */
    public effect(individual: Individual, group: Group, model: Model, t: number): void {};

    /**
     * 全部影响作用后
     * @param individual 影响个体
     * @param group 影响组
     * @param model 模型
     * @param t 经过时间
     */
    public afterEffect(individual: Individual, group: Group, model: Model, t: number): void {};

}

export { Behavior, BehaviorRecorder };
export default { Behavior };