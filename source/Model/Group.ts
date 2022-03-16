import { Individual } from "./Individual";
import { CtrlObject } from "./CtrlObject";
import type { Behavior } from "./Behavior"; 
import type { Label } from "./Label";

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
    public genCount?: number = 0;

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