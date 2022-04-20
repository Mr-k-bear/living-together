import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { Label } from "@Model/Label";
import { Behavior } from "@Model/Behavior";

type IObjectParamArchiveType = {
    __LIVING_TOGETHER_OBJECT_ID: string;
    __LIVING_TOGETHER_OBJECT_TYPE: string;
}

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
    "CG": IObjectParamCacheType<Label | Group | undefined, Group | undefined>;
    "CLG": IObjectParamCacheType<Label | Group | undefined, Group[]>;
}

type IMapArchiveObjectParamTypeKeyToType = {
    "R": IObjectParamCacheType<IObjectParamArchiveType | undefined>;
    "G": IObjectParamCacheType<IObjectParamArchiveType | undefined>;
    "LR": IObjectParamCacheType<IObjectParamArchiveType | undefined, IObjectParamArchiveType[]>;
    "LG": IObjectParamCacheType<IObjectParamArchiveType | undefined, IObjectParamArchiveType[]>;
    "CG": IObjectParamCacheType<IObjectParamArchiveType | undefined>;
    "CLG": IObjectParamCacheType<IObjectParamArchiveType | undefined, IObjectParamArchiveType[]>;
}

type IMapVectorParamTypeKeyToType = {
    "vec": number[];
    "color": number[];
}

/**
 * 参数类型映射
 */
type AllMapType = IMapBasicParamTypeKeyToType & IMapObjectParamTypeKeyToType & IMapVectorParamTypeKeyToType;
type AllArchiveMapType = IMapBasicParamTypeKeyToType & IMapArchiveObjectParamTypeKeyToType & IMapVectorParamTypeKeyToType;
type IParamType = keyof AllMapType;
type IObjectType = keyof IMapObjectParamTypeKeyToType;
type IVectorType = keyof IMapVectorParamTypeKeyToType;
type IParamValue<K extends IParamType> = AllMapType[K];
type IArchiveParamValue<K extends IParamType> = AllArchiveMapType[K];

/**
 * 特殊对象类型判定
 */
const objectTypeListEnumSet = new Set<string>(["R", "G", "LR", "LG", "CG", "CLG"]);

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
 * 压缩对象断言表达式
 */
function isArchiveObjectType(key: Object): key is IObjectParamArchiveType {
    return !!(
        (key as IObjectParamArchiveType).__LIVING_TOGETHER_OBJECT_ID &&
        (key as IObjectParamArchiveType).__LIVING_TOGETHER_OBJECT_TYPE
    );
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
     * 显示条件
     */
    condition?: {key: string, value: any};

    /**
     * 全部选项
     */
    allOption?: Array<{key: string, name: string}>;
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

type IArchiveParameterValue<P extends IParameter> = {
    [X in keyof P]: IArchiveParamValue<P[X]>
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
                
                case "CG":
                case "G":
                case "R":
                    defaultObj[key] = {
                        picker: undefined,
                        objects: undefined
                    } as any;
                    break;

                case "CLG":
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

type IRealObjectType = Range | Group | Label | Behavior;
type IArchiveParseFn = (archive: IObjectParamArchiveType) => IRealObjectType | undefined;

function object2ArchiveObject(object: IRealObjectType | IRealObjectType[] | any, testArray: boolean = true): 
IObjectParamArchiveType | IObjectParamArchiveType[] | undefined {
    if (object instanceof Range) {
        return {
            __LIVING_TOGETHER_OBJECT_ID: "Range",
            __LIVING_TOGETHER_OBJECT_TYPE: object.id
        }
    } else if (object instanceof Group) {
        return {
            __LIVING_TOGETHER_OBJECT_ID: "Group",
            __LIVING_TOGETHER_OBJECT_TYPE: object.id
        }
    } else if (object instanceof Label) {
        return {
            __LIVING_TOGETHER_OBJECT_ID: "Label",
            __LIVING_TOGETHER_OBJECT_TYPE: object.id
        }
    } else if (object instanceof Behavior) {
        return {
            __LIVING_TOGETHER_OBJECT_ID: "Behavior",
            __LIVING_TOGETHER_OBJECT_TYPE: object.id
        }
    } else if (Array.isArray(object) && testArray) {
        const hasValue = (item: any): item is IObjectParamArchiveType => !!item;
        return object.map(item => object2ArchiveObject(item, false)).filter(hasValue);
    } else {
        return undefined;
    }
}

function parameter2ArchiveObject<P extends IParameter>
(value: IParameterValue<P>, option?: IParameterOption<P>): IArchiveParameterValue<P> {
    let archive = {} as IArchiveParameterValue<P>;

    const handelColl = (key: string, cValue: IParamValue<IParamType>) => {

        // 处理对象类型
        if (cValue instanceof Object && !Array.isArray(cValue)) {
            const picker = (cValue as IObjectParamCacheType<any>).picker;
            const objects = (cValue as IObjectParamCacheType<any>).objects;

            (archive[key] as any) = {
                picker: object2ArchiveObject(picker),
                objects: object2ArchiveObject(objects)
            }
        }

        // 处理数组类型
        else if (Array.isArray(cValue)) {
            (archive[key] as any) = cValue.concat([]);
        }

        // 处理数值
        else {
            (archive[key] as any) = cValue;
        }
    }

    // 存在参考设置对象
    if (option) {
        for (const key in option) {
            handelColl(key, value[key]);
        }
    }
    
    // 不存在设置对象
    else {
        for (const key in value) {
            handelColl(key, value[key]);
        }
    }

    return archive;
}

function archiveObject2Parameter<P extends IParameter>
(value: IArchiveParameterValue<P>, parse: IArchiveParseFn, option?: IParameterOption<P>): IParameterValue<P> {
    let parameter = {} as IParameterValue<P>;

    const handelColl = (key: string, cValue: IArchiveParamValue<IParamType>) => {

        // 处理对象类型
        if (cValue instanceof Object && !Array.isArray(cValue)) {
            const picker = (cValue as IObjectParamCacheType<IObjectParamArchiveType>).picker;
            const objects = (cValue as IObjectParamCacheType<IObjectParamArchiveType>).objects;

            (parameter[key] as any) = {
                picker: picker ? parse(picker) : picker,
                objects: objects ? parse(objects) : objects
            }
        }

        // 处理数组类型
        else if (Array.isArray(cValue)) {
            (parameter[key] as any) = cValue.concat([]);
        }

        // 处理数值
        else {
            (parameter[key] as any) = cValue;
        }
    }

    // 存在参考设置对象
    if (option) {
        for (const key in option) {
            handelColl(key, value[key]);
        }
    }
    
    // 不存在设置对象
    else {
        for (const key in value) {
            handelColl(key, value[key]);
        }
    }

    return parameter;
}

export {
    IParamType, IParamValue, isObjectType, isVectorType, getDefaultValue,
    IParameterOptionItem, IParameter, IParameterOption, IParameterValue,
    object2ArchiveObject, parameter2ArchiveObject
}