import type { Group } from "./Group";

/**
 * 群中的个体类型
 */
class Individual {

	/**
	 * 坐标
	 */
	public position: number[] = [0, 0, 0];

	/**
	 * 所属群组
	 */
	public group: Group;

	/**
	 * 初始化
	 */
	public constructor(group: Group) {
		this.group = group;
	}
}

export default Individual;
export { Individual };