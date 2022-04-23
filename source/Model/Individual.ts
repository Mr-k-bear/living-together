import type { Group } from "@Model/Group";
import { IAnyObject, ObjectID } from "@Model/Model";
import { IArchiveParseFn, object2ArchiveObject, isArchiveObjectType } from "@Model/Parameter";

interface IArchiveIndividual {
    id: string;
    position: number[];
    velocity: number[];
    acceleration: number[];
    force: number[];
    metaData: IAnyObject;
}

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
    public vectorLength(x: number[]): number;
    public vectorLength(x: number, y: number, z: number): number;
    public vectorLength(x: number | number[], y?: number, z?: number): number {
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
    public vectorNormalize(x: number[]): [number, number, number];
    public vectorNormalize(x: number, y: number, z: number): [number, number, number];
    public vectorNormalize(x: number | number[], y?: number, z?: number): [number, number, number] {
        let length = this.vectorLength(x as number, y as number, z as number);
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

    public id: string;

	/**
	 * 坐标
	 */
	public position: number[] = [0, 0, 0];

    /**
     * 速度
     */
    public velocity: number[] = [0, 0, 0];

    /**
     * 加速度
     */
    public acceleration: number[] = [0, 0, 0];

    /**
     * 作用力
     */
    public force: number[] = [0, 0, 0];

    /**
     * 施加力
     */
    public applyForce(x: number[]): [number, number, number];
    public applyForce(x: number, y: number, z: number): [number, number, number];
    public applyForce(x: number | number[], y?: number, z?: number): [number, number, number] {
        if (Array.isArray(x)) {
            this.force[0] += x[0] ?? 0;
            this.force[1] += x[1] ?? 0;
            this.force[2] += x[2] ?? 0;
        } else {
            this.force[0] += x ?? 0;
            this.force[1] += y ?? 0;
            this.force[2] += z ?? 0;
        }
        return this.force as [number, number, number];
    }

	/**
	 * 所属群组
	 */
	public group: Group | undefined;

	/**
	 * 初始化
	 */
	public constructor(group: Group) {
		this.group = group;
        this.id = this.group.model.getNextIndividualId();
	}

    public isDie(): boolean {
        return !!this.group;
    }

    /**
     * 死亡
     */
    public die(): this {
        this.group?.remove(this);
        this.group = undefined;
        return this;
    }

    /**
     * 转移到新群体
     * @param newGroup 新群体
     */
    public transfer(newGroup: Group): this {
        this.group?.remove(this);
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
        return this.vectorLength(this.vectorTo(position));
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

    public toArchive(): IArchiveIndividual {

        const metaDataArchive = {} as IAnyObject;
        this.metaData.forEach((value, key) => {
            
            // 处理内置对象
            let ltObject = object2ArchiveObject(value);
            if (ltObject) {
                metaDataArchive[key] = ltObject;
            }

            // 处理数组
            else if (Array.isArray(value)) {
                metaDataArchive[key] = value.concat([]);
            }

            // 处理值
            else {
                metaDataArchive[key] = value;
            }
        });

        return {
            id: this.id,
            position: this.position.concat([]),
            velocity: this.velocity.concat([]),
            acceleration: this.acceleration.concat([]),
            force: this.force.concat([]),
            metaData: metaDataArchive
        };
    }

    public fromArchive(archive: IArchiveIndividual, paster: IArchiveParseFn): void {

        const metaData = new Map() as Map<ObjectID, any>;
        for (const key in archive.metaData) {
            
            const value = archive.metaData[key];

            // 处理内置对象
            if (value instanceof Object && isArchiveObjectType(value)) {
                metaData.set(key, paster(value));
            }

            else if (Array.isArray(value)) {
                metaData.set(key, value.concat([]));
            }

            else {
                metaData.set(key, value);
            }
        }

        this.id = archive.id,
        this.position = archive.position.concat([]),
        this.velocity = archive.velocity.concat([]),
        this.acceleration = archive.acceleration.concat([]),
        this.force = archive.force.concat([]),
        this.metaData = metaData;
    }
}

export { Individual, IArchiveIndividual };