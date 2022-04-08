import type { Group } from "@Model/Group";
import type { Range } from "@Model/Range";
import type { Label } from "@Model/Label";

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
    "option": string;
}

type IMapObjectParamTypeKeyToType = {
    "R": IObjectParamCacheType<Range | undefined>;
    "G": IObjectParamCacheType<Group | undefined>;
    "LR": IObjectParamCacheType<Label | Range | undefined, Range[]>;
    "LG": IObjectParamCacheType<Label | Group | undefined, Group[]>;
}

type IMapVectorParamTypeKeyToType = {
    "vec": number[];
    "color": number[];
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
const objectTypeListEnumSet = new Set<string>(["R", "G", "LR", "LG"]);

 /**
  * 对象断言表达式
  */
function isObjectType(key: string): key is IVectorType {
    return objectTypeListEnumSet.has(key);
}
 
 /**
  * 向量断言表达式
  */
function isVectorType(key: string): key is IObjectType {
    return key === "vec";
}

/**
 * 模型参数类型
 */
interface IParameterOptionItem<T extends IParamType = IParamType> {

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

    /**
     * 图标是否显示为红色
     */
    iconRed?: boolean;

    /**
     * 颜色是否进行归一化
     */
    colorNormal?: boolean;

    /**
     * 全部选项
     */
    allOption?: string[];
}

interface IParameter {
    [x: string]: IParamType;
}

/**
 * 参数类型列表
 */
type IParameterOption<P extends IParameter> = {
    [X in keyof P]: IParameterOptionItem<P[X]>;
}

/**
 * 参数类型列表映射到参数对象
 */
type IParameterValue<P extends IParameter> = {
    [X in keyof P]: IParamValue<P[X]>
}

function getDefaultValue<P extends IParameter> (option: IParameterOption<P>): IParameterValue<P> {
    let defaultObj = {} as IParameterValue<P>;
    for (let key in option) {
        let defaultVal = option[key].defaultValue;
        
        if (defaultVal !== undefined) {
            defaultObj[key] = defaultVal;
        } else {

            switch (option[key].type) {
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
                
                case "G":
                case "R":
                    defaultObj[key] = {
                        picker: undefined,
                        objects: undefined
                    } as any;
                    break;

                case "LR":
                case "LG":
                    defaultObj[key] = {
                        picker: undefined,
                        objects: []
                    } as any;
                    break;
            }
        }
    }
    return defaultObj;
}

export {
    IParamType, IParamValue, isObjectType, isVectorType, getDefaultValue,
    IParameterOptionItem, IParameter, IParameterOption, IParameterValue
}