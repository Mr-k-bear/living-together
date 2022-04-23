import { Emitter, EventType } from "@Model/Emitter";
import { CtrlObject, IArchiveCtrlObject } from "@Model/CtrlObject";
import { Model } from "@Model/Model";
import { IArchiveLabel, Label } from "@Model/Label";
import { Group, IArchiveGroup } from "@Model/Group";
import { Range } from "@Model/Range";
import { IArchiveIndividual, Individual } from "@Model/Individual";
import { Behavior, IArchiveBehavior } from "@Model/Behavior";
import { getBehaviorById } from "@Behavior/Behavior";
import { IArchiveParseFn, IObjectParamArchiveType, IRealObjectType } from "@Model/Parameter";

interface IArchiveEvent {
    fileSave: Archive;
    fileLoad: Archive;
    fileChange: void;
}

interface IArchiveObject {
    nextIndividualId: number;
    objectPool: IArchiveCtrlObject[];
    labelPool: IArchiveLabel[];
    behaviorPool: IArchiveBehavior[];
}

class Archive<M extends any = any> extends Emitter<IArchiveEvent> {

    /**
     * 是否为新文件
     */
    public isNewFile: boolean = true;

    /**
     * 文件名
     */
    public fileName?: string;

    /**
     * 是否保存
     */
    public isSaved: boolean = false;

    /**
     * 文件数据
     */
    public fileData?: M;

    /**
     * 将模型转换为存档对象
     */
    public parseModel2Archive(model: Model): string {

        // 存贮 CtrlObject
        const objectPool: IArchiveCtrlObject[] = [];
        model.objectPool.forEach(obj => {
            let archiveObject = obj.toArchive();

            // 处理每个群的个体
            if (archiveObject.objectType === "G") {
                const archiveGroup: IArchiveGroup = archiveObject as any;
                const group: Group = obj as Group;

                const individuals: IArchiveIndividual[] = [];
                group.individuals.forEach((item) => {
                    individuals.push(item.toArchive());
                });

                archiveGroup.individuals = individuals;
            }

            objectPool.push(archiveObject);
        })

        // 存储 Label
        const labelPool: IArchiveLabel[] = [];
        model.labelPool.forEach(obj => {
            labelPool.push(obj.toArchive());
        });

        // 存储全部行为
        const behaviorPool: IArchiveBehavior[] = [];
        model.behaviorPool.forEach(obj => {
            behaviorPool.push(obj.toArchive());
        });

        // 生成存档对象
        const fileData: IArchiveObject = {
            nextIndividualId: model.nextIndividualId,
            objectPool: objectPool,
            labelPool: labelPool,
            behaviorPool: behaviorPool
        };

        return JSON.stringify(fileData);
    }

    /**
     * 加载存档到模型
     */
    public loadArchiveIntoModel(model: Model, data: string): void {

        // 解析为 JSON 对象
        const archive: IArchiveObject = JSON.parse(data);
        console.log(archive);

        // 实例化全部对象
        const objectPool: CtrlObject[] = [];
        const individualPool: Individual[] = [];
        archive.objectPool.forEach((obj) => {

            let ctrlObject: CtrlObject | undefined = undefined;
            
            // 处理群
            if (obj.objectType === "G") {
                const archiveGroup: IArchiveGroup = obj as any;
                const newGroup = new Group(model);

                // 实例化全部个体
                const individuals: Array<Individual> = [];
                archiveGroup.individuals.forEach((item) => {
                    const newIndividual = new Individual(newGroup);
                    newIndividual.id = item.id;
                    individuals.push(newIndividual);
                    individualPool.push(newIndividual);
                })
                
                newGroup.cacheIndividualsArray = individuals;
                ctrlObject = newGroup;
            }

            // 处理范围
            if (obj.objectType === "R") {
                ctrlObject = new Range(model);
            }

            if (ctrlObject) {
                ctrlObject.id = obj.id;
                objectPool.push(ctrlObject);
            }
        });

        // 实例化全部标签
        const labelPool: Label[] = [];
        archive.labelPool.forEach((item) => {
            const newLabel = new Label(model);
            newLabel.id = item.id;
            labelPool.push(newLabel);
        });

        // 实例化全部行为
        const behaviorPool: Behavior[] = [];
        archive.behaviorPool.forEach((item) => {
            const recorder = getBehaviorById(item.behaviorId);
            const newBehavior = recorder.new();
            newBehavior.id = item.id;
            behaviorPool.push(newBehavior);
        });

        // 内置标签集合
        const buildInLabel = [model.allGroupLabel, model.allRangeLabel, model.currentGroupLabel]

        const search: <T extends IRealObjectType>(pool: T[], archive: IObjectParamArchiveType) => T | undefined =
        (pool, archive) => {
            for (let i = 0; i < pool.length; i++) {
                if (pool[i].id === archive.__LIVING_TOGETHER_OBJECT_ID) {
                    return pool[i];
                }
            }

            return undefined;
        };

        const searchAll: (archive: IObjectParamArchiveType) => IRealObjectType | undefined =
        (archive) => {
            return void 0 ??
                search(individualPool, archive) ??
                search(objectPool, archive) ??
                search(labelPool, archive) ??
                search(buildInLabel, archive) ??
                search(behaviorPool, archive);
        }

        // 实例搜索函数
        const parseFunction: IArchiveParseFn = (archive) => {

            switch (archive.__LIVING_TOGETHER_OBJECT_TYPE) {

                // 在个体池搜索
                case "Individual":
                    return search(individualPool, archive) ?? searchAll(archive);

                // 对象类型在对象池中搜索
                case "Range":
                case "Group":
                    return search(objectPool, archive) ?? searchAll(archive);

                // 在标签池搜索
                case "Label":
                    return search(labelPool, archive) ?? search(buildInLabel, archive) ?? searchAll(archive);

                // 在标签池搜索
                case "Behavior":
                    return search(behaviorPool, archive) ?? searchAll(archive);

                // 在全部池子搜索
                default:
                    return searchAll(archive);
            }
        }

        // 加载对象的属性
        model.objectPool = objectPool.map((obj, index) => {
            
            // 加载属性
            obj.fromArchive(archive.objectPool[index], parseFunction);

            // 加载个体属性
            if (obj instanceof Group) {

                const archiveGroup: IArchiveGroup = archive.objectPool[index] as any;

                obj.individuals = new Set(obj.cacheIndividualsArray.map((item, i) => {
                    item.fromArchive(archiveGroup.individuals[i], parseFunction);
                    return item;
                }));
            }

            return obj;
        });

        // 加载标签属性
        model.labelPool = labelPool.map((item, index) => {
            item.fromArchive(archive.labelPool[index]);
            return item;
        });

        // 加载行为属性
        model.behaviorPool = behaviorPool.map((item, index) => {
            item.fromArchive(archive.behaviorPool[index], parseFunction);
            return item;
        });
    }

    /**
     * 保存文件
     * 模型转换为文件
     */
    public save(model: Model): string {
        this.isSaved = true;
        this.emit("fileSave", this);
        return this.parseModel2Archive(model);
    }

    /**
     * 加载文件为模型
     * @return Model
     */
    public load(model: Model, data: string): string | undefined {

        try {
            this.loadArchiveIntoModel(model, data);
        } catch (e) {
            return e as string;
        }
        
        this.isSaved = true;
        this.emit("fileLoad", this);
    };

    public constructor() {
        super();
        this.on("fileChange", () => {
            this.isSaved = false;
        })
    }
}

export { Archive };