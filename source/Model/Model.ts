
import { Individual } from "./Individual";
import { Group } from "./Group";
import { Emitter, EventType, EventMixin } from "./Emitter";
import { CtrlObject } from "./CtrlObject";
import { ObjectID } from "./Renderer";

type ModelEvent = {
    addGroup: Group;
    deleteGroup: Group[];
};

/**
 * 模型 全局控制器
 */
class Model extends Emitter<ModelEvent> {

    /**
     * 下一个需要分配的 ID
     */
    private idIndex: number = 1;
    public get nextId(): number {
        return this.idIndex ++;
    }

    /**
     * 对象列表
     */
    public objectPool: CtrlObject[] = [];

    /**
     * 添加组
     */
    public addGroup(): void {
        console.log(`Model: Creat group with id ${this.idIndex}`);
        let group = new Group(this, this.nextId);
        this.objectPool.push(group);
        this.emit("addGroup", group);
    }

    /**
     * 删除组
     */
    public deleteGroup(groups: Group[] | ObjectID[]): void {
        let deletedGroups: Group[] = [];
        this.objectPool = this.objectPool.filter((object) => {
            if (!(object instanceof Group)) return true;
            let deletedGroup: Group | undefined;

            for (let i = 0; i < groups.length; i++) {
                if (groups[i] instanceof Group) {
                    if (groups[i] === object) {
                        deletedGroup = object;
                    }
                } else {
                    if (groups[i] === object.id) {
                        deletedGroup = object;
                    }
                }
            }

            if (deletedGroup) {
                deletedGroups.push(deletedGroup);
                return false;
            } else {
                return true;
            }
        });

        this.emit("deleteGroup", deletedGroups);
    }
}

export {
    Individual,
    Group,
    Emitter,
    EventType,
    EventMixin,
    Model,
    CtrlObject,
    ObjectID
}