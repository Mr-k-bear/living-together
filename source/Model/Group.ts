import { Individual } from "./Individual";
import { CtrlObject } from "./CtrlObject";
import type { Behavior } from "./Behavior"; 
import { Label } from "./Label";
import { Range } from "./Range";

enum GenMod {
    Point = "p",
    Range = "R"
}

/**
 * 群体类型
 */
class Group extends CtrlObject {

	/**
	 * 所有个体
	 */
	public individuals: Set<Individual> = new Set();

    /**
     * 个体生成方式
     */
    public genMethod: GenMod = GenMod.Point;

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
    public genCount: number = 1;

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
    public killCount: number = 1;

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
                this.individuals.delete(individual[i]);
            }
        } else {
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
	public behaviors: Behavior[] = [];

	/**
	 * 添加行为
	 * @param behavior 添加行为 
	 */
	public addBehavior(behavior: Behavior | Behavior[]): this {
		if (Array.isArray(behavior)) {
			this.behaviors = this.behaviors.concat(behavior);
		} else {
			this.behaviors.push(behavior);
		}

		// 按照优先级
		this.behaviors = this.behaviors.sort((b1, b2) => {
			return (b1.priority ?? 0) - (b2.priority ?? 0)
		});
		return this;
	}

	/**
     * 执行行为影响
	 * @param
     */
	public runner(t: number, effectType: "beforeEffect" | "effect" | "afterEffect" ): void {
		this.individuals.forEach((individual) => {
			for(let j = 0; j < this.behaviors.length; j++) {
				this.behaviors[j][effectType](individual, this, this.model, t);
			}
		});
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
     * 绘制大小 
     */
    public size: number = 60;
}

export default Group;
export { Group, GenMod };