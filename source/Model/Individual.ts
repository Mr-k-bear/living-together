import type { Group } from "./Group";
import { ObjectID } from "./Renderer";

/**
 * 群中的个体类型
 */
class Individual {

    /**
     * 计算向量长度
     * @param x x 坐标 | 向量
     * @param y y 坐标
     * @param z z 坐标
     */
    public static vectorLength(x: number[]): number;
    public static vectorLength(x: number, y: number, z: number): number;
    public static vectorLength(x: number | number[], y?: number, z?: number): number {
        if (Array.isArray(x)) {
            return ((x[0] ?? 0)**2 + (x[1] ?? 0)**2 + (x[2] ?? 0)**2)**.5;
        } else {
            return ((x ?? 0)**2 + (y ?? 0)**2 + (z ?? 0)**2)**.5;
        }
    }

    /**
     * 向量归一化
     * @param x x 坐标 | 向量
     * @param y y 坐标
     * @param z z 坐标
     */
    public static vectorNormalize(x: number[]): [number, number, number];
    public static vectorNormalize(x: number, y: number, z: number): [number, number, number];
    public static vectorNormalize(x: number | number[], y?: number, z?: number): [number, number, number] {
        let length = Individual.vectorLength(x as number, y as number, z as number);
        if (Array.isArray(x)) {
            return [
                (x[0] ?? 0) / length,
                (x[1] ?? 0) / length,
                (x[2] ?? 0) / length
            ];
        } else {
            return [
                (x ?? 0) / length,
                (y ?? 0) / length,
                (z ?? 0) / length
            ];
        }
    }

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

    /**
     * 死亡
     */
    public die(): this {
        this.group.remove(this);
        return this;
    }

    /**
     * 转移到新群体
     * @param newGroup 新群体
     */
    public transfer(newGroup: Group): this {
        this.group.remove(this);
        newGroup.add(this);
        this.group = newGroup;
        return this;
    }

    /**
     * 计算从此个体到目标位置的向量
     */
    public vectorTo(position: Individual | number[]): [number, number, number] {
        if (position instanceof Individual) {
            return [
                position.position[0] - this.position[0],
                position.position[1] - this.position[1],
                position.position[2] - this.position[2]
            ];
        } else {
            return [
                (position[0] ?? 0) - this.position[0],
                (position[1] ?? 0) - this.position[1],
                (position[2] ?? 0) - this.position[2]
            ];
        }
    }

    /**
     * 计算与目标位置距离
     * @param position 目标位置
     */
    public distanceTo(position: Individual | number[]): number {
        return Individual.vectorLength(this.vectorTo(position));
    }

    /**
     * 保存提供给 Behavior 使用的数据
     */
    private metaData: Map<ObjectID, any> = new Map();

    /**
     * 获取元数据
     */
    public getData<T = any>(key: ObjectID): T {
        return this.metaData.get(key);
    }

    /**
     * 设置元数据
     */
    public setData<T = any>(key: ObjectID, value: T): T {
        this.metaData.set(key, value);
        return value;
    }
}

export default Individual;
export { Individual };