import type { Group } from "./Group";
import type { Range } from "./Range";
import type { Label } from "./Label";

type IObjectParamCacheType<P, Q = P> = {
    picker: P;
    objects: Q;
}

/**
 * 参数类型
 */
type IMapBasicParamTypeKeyToType = {
    "number": number;
    "string": string;
    "boolean": boolean;
}

type IMapObjectParamTypeKeyToType = {
    "R": IObjectParamCacheType<Range | undefined>;
    "G": IObjectParamCacheType<Group | undefined>;
    "LR": IObjectParamCacheType<Label | Range | undefined, Range[]>;
    "LG": IObjectParamCacheType<Label | Group | undefined, Group[]>;
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
const objectTypeListEnumSet = new Set<IParamType>(["R", "G", "LR", "LG"]);

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
    type: T | string;

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
    maxLength?: number;

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

interface IBehaviorParameter {
    [x: string]: IParamType;
}

/**
 * 参数类型列表
 */
type IBehaviorParameterOption<P extends IBehaviorParameter> = {
    [X in keyof P]: IBehaviorParameterOptionItem<P[X]>;
}

/**
 * 参数类型列表映射到参数对象
 */
type IBehaviorParameterValue<P extends IBehaviorParameter> = {
    [X in keyof P]: IParamValue<P[X]>
}

export {
    IParamType, IParamValue, isObjectType, isVectorType,
    IBehaviorParameterOptionItem, IBehaviorParameter, IBehaviorParameterOption, IBehaviorParameterValue
}