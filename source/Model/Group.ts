import { Individual } from "@Model/Individual";
import { CtrlObject, IArchiveCtrlObject } from "@Model/CtrlObject";
import type { Behavior, IAnyBehavior } from "@Model/Behavior"; 
import { Label } from "@Model/Label";
import { Range } from "@Model/Range";
import { Model, ObjectID } from "@Model/Model";
import { IArchiveIndividual } from "@Model/Individual";
import {
    getDefaultValue, IArchiveParseFn,
    IObjectParamArchiveType, object2ArchiveObject
} from "@Model/Parameter";

enum GenMod {
    Point = "p",
    Range = "R"
}

interface IArchiveGroup {
    individuals: IArchiveIndividual[];
    genMethod: Group["genMethod"];
    genPoint: Group["genPoint"];
    genRange: IObjectParamArchiveType | undefined;
    genCount: Group["genCount"];
    genErrorMessage: Group["genErrorMessage"];
    genErrorMessageShowCount: Group["genErrorMessageShowCount"];
    killCount: Group["killCount"];
    behaviors: IObjectParamArchiveType[];
}

/**
 * 群体类型
 */
class Group extends CtrlObject<IArchiveGroup> {

	/**
	 * 所有个体
	 */
	public individuals: Set<Individual> = new Set();

    /**
     * 缓存的 individuals 数组, 用于存档加载
     */
    public cacheIndividualsArray: Array<Individual> = [];

    /**
     * 个体生成方式
     */
    public genMethod: GenMod = GenMod.Range;

    /**
     * 生成位置坐标
     */
    public genPoint: number[] = [0, 0, 0];

    /**
     * 生成范围
     */
    public genRange?: CtrlObject | Label;

    /**
     * 生成个数
     */
    public genCount: number = 100;

    /**
     * 生成错误信息
     */
    public genErrorMessage?: string;

    /**
     * 生成错误信息
     */
    public genErrorMessageShowCount: number = 0;

    /**
     * 删除个数
     */
    public killCount: number = 100;

    private genInSingleRange(count: number, range: Range) {
        for (let i = 0; i < count; i++) {
            let individual = new Individual(this);
            individual.position[0] = range.position[0] + (Math.random() - .5) * 2 * range.radius[0];
            individual.position[1] = range.position[1] + (Math.random() - .5) * 2 * range.radius[1];
            individual.position[2] = range.position[2] + (Math.random() - .5) * 2 * range.radius[2];
            this.add(individual);
        }
    }

    private genWithPointMod(): boolean {
        for (let i = 0; i < this.genCount; i++) {
            let individual = new Individual(this);
            individual.position[0] = this.genPoint[0];
            individual.position[1] = this.genPoint[1];
            individual.position[2] = this.genPoint[2];
            this.add(individual);
        }
        return true;
    }

    private genWithRangeMod(): boolean {
        let rangeList: Range[] = [];

        // 单一范围对象
        if (this.genRange instanceof Range) {

            // 无效的对象
            if (this.genRange.isDeleted()) {
                this.genErrorMessage = "Common.Attr.Key.Generation.Error.Invalid.Range";
                return false;
            }
            
            else {
                rangeList = [this.genRange];
            }
        }

        // 多重范围对象
        else if (this.genRange instanceof Label) {

            // 无效的标签
            if (this.genRange.isDeleted()) {
                this.genErrorMessage = "Common.Attr.Key.Generation.Error.Invalid.Label";
                return false;
            }
            
            else {
                let objList: CtrlObject[] = this.model.getObjectByLabel(this.genRange);
                rangeList = objList.filter((obj) => {
                    return obj instanceof Range
                }) as Range[];
            }
        }

        // 空对象
        else {
            this.genErrorMessage = "Common.Attr.Key.Generation.Error.Empty.Object";
            return false;
        }

        // 单一范围生成
        if (rangeList.length === 1) {
            this.genInSingleRange(this.genCount, rangeList[0]);
            return true;
        }

        // 多重范围
        else if (rangeList.length > 1) {
            let allVolume: number = 0;
            let allGenCount: number = 0;
            let genData: number[] = [];

            // 计算体积
            for (let i = 0; i < rangeList.length; i++) {
                let volume =
                    rangeList[i].radius[0] *
                    rangeList[i].radius[1] *
                    rangeList[i].radius[2];
                allVolume += volume;
                genData.push(volume);
            }

            // 按权重分配生成个数
            for (let i = 0; i < genData.length; i++) {
                const count = Math.floor((genData[i] / allVolume) * this.genCount) + 1;
                allGenCount += count;
                genData[i] = count;
            }

            // 按照溢出个数删除冗余个数
            let morCount = allGenCount - this.genCount;
            let safeCount = 0;
            while (morCount > 0 && safeCount < 1000) {
                safeCount ++;
                let randomIndex = Math.floor(Math.random() * genData.length);
                if (genData[randomIndex] > 0) {
                    genData[randomIndex] --;
                    morCount --;
                }
            }

            // 数据生成
            for (let i = 0; i < rangeList.length; i++) {
                this.genInSingleRange(genData[i], rangeList[i]);
            }
            
            return true;
        }

        // 空数据
        else {
            this.genErrorMessage = "Common.Attr.Key.Generation.Error.Empty.Range.List";
            return false;
        }

        this.genErrorMessage = "Common.No.Unknown.Error";
        return false;
    }

    /**
     * 生成个体
     */
    public genIndividuals(): boolean {
        let success = false;
        switch (this.genMethod) {
            case GenMod.Point:
                success = this.genWithPointMod();
                break;
            case GenMod.Range:
                success = this.genWithRangeMod();
                break;  
        }
        if (success) {
            this.model.emit("individualChange", this);
        }
        return success;
    }

    /**
     * 随机杀死个体
     */
    public killIndividuals(): boolean {
        let success = false;
        let killCount = this.killCount;
        if (killCount > this.individuals.size) {
            killCount = this.individuals.size;
        }

        // 生成索引数组
        const allIndex = new Array(this.individuals.size).fill(0).map((_, i) => i);
        const deleteIndex: Set<number> = new Set();

        for (let i = 0; i < killCount; i++) {
            let randomIndex = Math.floor(Math.random() * allIndex.length);
            deleteIndex.add(allIndex[randomIndex]);
            allIndex.splice(randomIndex, 1);
        }

        let j = 0;
        this.individuals.forEach((individual) => {
            if (deleteIndex.has(j)) {
                this.remove(individual);
                success = true;
            }
            j++;
        });

        if (success) {
            this.model.emit("individualChange", this);
        }

        return success
    }

	/**
	 * 创建个体
     * @param count 创建数量
	 */
	public new(count: number = 1): Individual {
        let newIndividual: Individual | undefined;
		for (let i = 0; i < count; i++) {
            newIndividual = new Individual(this);
			this.individuals.add(newIndividual);
		}
        if (newIndividual) {
            return newIndividual;
        } else {
            return new Individual(this);
        }
	}

    /**
     * 添加个体
     * @param individual 个体
     */
    public add(individual: Individual[] | Individual): this {
        if (Array.isArray(individual)) {
            for (let i = 0; i < individual.length; i++) {
                individual[i].group = this;
                this.individuals.add(individual[i]);
            }
        } else {
            individual.group = this;
            this.individuals.add(individual);
        }
        return this;
    }

    /**
     * 移除成员
     * @param individual 需要移除的个体
     */
    public remove(individual: Individual[] | Individual): this {
        if (Array.isArray(individual)) {
            for (let i = 0; i < individual.length; i++) {
                individual[i].group = undefined;
                this.individuals.delete(individual[i]);
            }
        } else {
            individual.group = undefined;
            this.individuals.delete(individual);
        }
        return this;
    }

    /**
     * 通过距离获取个体
     * 此函数将排除传入对象
     * @param position 观测位置
     * @param distance 距离
     * @param excludeSelf 是否排除自身
     */
    public getIndividualsByDistance(
        position: Individual | number[], distance: number, excludeSelf?: boolean
    ): Individual[] {
        const result: Individual[] = [];
        this.individuals.forEach(((individual) => {

            // 排除自身
            if (individual === position && excludeSelf) {
                return;
            }

            if (individual.distanceTo(position) < distance) {
                result.push(individual);
            }
        }));
        return result;
    }

	/**
	 * 行为列表
	 */
	public behaviors: IAnyBehavior[] = [];

	/**
	 * 添加行为
	 * @param behavior 添加行为 
	 */
	public addBehavior(behavior: Behavior | Behavior[]): this {
		if (Array.isArray(behavior)) {
			this.behaviors = this.behaviors.concat(behavior);
            for (let i = 0; i < behavior.length; i++) {
                behavior[i].mount(this, this.model);
            }
		} else {
			this.behaviors.push(behavior);
            behavior.mount(this, this.model);
		}

		// 按照优先级
		this.behaviors = this.behaviors.sort((b1, b2) => {
			return (b1.priority ?? 0) - (b2.priority ?? 0)
		});
		return this;
	}

    /**
	 * 删除行为
	 * @param behavior 添加行为 
	 */
	public deleteBehavior(behavior: Behavior): this {
        
        let deleteIndex = -1;
        for (let i = 0; i < this.behaviors.length; i++) {
            if (this.behaviors[i].id === behavior.id) {
                deleteIndex = i;
            }
        }

        if (deleteIndex >= 0) {
            this.behaviors[deleteIndex].unmount(this, this.model);
            this.behaviors.splice(deleteIndex, 1);
        }

		return this;
	}

	/**
     * 执行行为影响
	 * @param
     */
	public runner(t: number, effectType: "finalEffect" | "effect" | "afterEffect" ): void {

        for(let j = 0; j < this.behaviors.length; j++) {

            const behavior = this.behaviors[j];
            if (behavior.isDeleted()) {
                continue;
            }

            const runnerFunction = behavior[effectType];
            if (!runnerFunction) {
                continue;
            }
            
            for (let k = 0; k < behavior.currentGroupKey.length; k++) {

                let parameterCache = behavior.parameter[
                    behavior.currentGroupKey[k] as string
                ];

                if (Array.isArray(parameterCache?.objects)) {
                    parameterCache.objects = [this];

                } else {
                    parameterCache.objects = this;
                }
            }

            this.individuals.forEach((individual) => {
                runnerFunction(individual, this, this.model, t);
            });
        }
	}

    /**
     * 导出坐标数据
     */
    public exportPositionData(): Float32Array {
        let index = 0;
        let dataBuffer = new Float32Array(this.individuals.size * 3);
        this.individuals.forEach((individual) => {
            dataBuffer[index ++] = individual.position[0];
            dataBuffer[index ++] = individual.position[1];
            dataBuffer[index ++] = individual.position[2];
        });
        return dataBuffer;
    }

    /**
     * 导出个体id列表
     */
    public exportPositionId(idMapper: (id: string) => number ): [Float32Array, number[]] {
        let bi = 0; let ii = 0;
        let dataBuffer = new Float32Array(this.individuals.size * 3);
        let idBUffer: number[] = new Array(this.individuals.size).fill("");
        this.individuals.forEach((individual) => {
            idBUffer[ii ++] = idMapper(individual.id);
            dataBuffer[bi ++] = individual.position[0];
            dataBuffer[bi ++] = individual.position[1];
            dataBuffer[bi ++] = individual.position[2];
        });
        return [dataBuffer, idBUffer];
    }

    public override toArchive(): IArchiveCtrlObject & IArchiveGroup {
        return {
            ...super.toArchive(),
            objectType: "G",
            genMethod: this.genMethod,
            genPoint: this.genPoint.concat([]),
            genRange: object2ArchiveObject(this.genRange) as IObjectParamArchiveType,
            genCount: this.genCount,
            genErrorMessage: this.genErrorMessage,
            genErrorMessageShowCount: this.genErrorMessageShowCount,
            killCount: this.killCount,
            behaviors: object2ArchiveObject(this.behaviors) as IObjectParamArchiveType[]
        };
    }

    public override fromArchive(archive: IArchiveCtrlObject & IArchiveGroup, paster: IArchiveParseFn): void {
        super.fromArchive(archive, paster);
        this.genMethod = archive.genMethod,
        this.genPoint = archive.genPoint.concat([]),
        this.genRange = archive.genRange ? paster(archive.genRange) as any : undefined,
        this.genCount = archive.genCount,
        this.genErrorMessage = archive.genErrorMessage,
        this.genErrorMessageShowCount = archive.genErrorMessageShowCount,
        this.killCount = archive.killCount,
        this.behaviors = archive.behaviors.map((item) => {
            return item ? paster(item) as any : undefined;
        }).filter(c => !!c);
    }
    
    public constructor(model: Model) {

        super(model);
        
        if (model.renderer) {
            this.renderParameter = getDefaultValue(model.renderer.pointsParameterOption);
        }
    }
}

export { Group, GenMod, IArchiveGroup };