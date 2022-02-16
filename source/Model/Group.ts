import { Individual } from "./Individual";

/**
 * 群体类型
 */
class Group {

	/**
	 * 所有成员
	 */
	public individuals: Individual[] = [];

	/**
	 * 添加一个成员
	 */
	public add(count: number = 1) {
		for (let i = 0; i < count; i++) {
			this.individuals.push(new Individual(this));
		}
	}
}

export default Group;
export { Group };