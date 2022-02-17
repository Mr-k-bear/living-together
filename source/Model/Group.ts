import { Individual } from "./Individual";

/**
 * 群体类型
 */
class Group {

	/**
	 * 所有个体
	 */
	public individuals: Set<Individual> = new Set();

	/**
	 * 创建个体
     * @param count 创建数量
	 */
	public new(count: number = 1): this {
		for (let i = 0; i < count; i++) {
			this.individuals.add(new Individual(this));
		}
        return this;
	}

    /**
     * 添加个体
     * @param individual 个体
     */
    public add(individual: Individual[] | Individual): this {
        if (Array.isArray(individual)) {
            for (let i = 0; i < individual.length; i++) {
                this.individuals.add(individual[i]);
            }
        } else {
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
}

export default Group;
export { Group };