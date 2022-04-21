import { LabelObject } from "@Model/Label"
import { v4 as uuid } from "uuid";
import { parameter2ArchiveObject, archiveObject2Parameter, IArchiveParseFn } from "@Model/Parameter";
import type { IAnyObject, Model } from "@Model/Model";
import type { ObjectID } from "@Model/Model";

interface IArchiveCtrlObject {
    displayName: CtrlObject["displayName"];
    color: CtrlObject["color"];
    display: CtrlObject["display"];
    update: CtrlObject["update"];
    id: string;
    renderParameter: any;
    deleteFlag: CtrlObject["deleteFlag"];
}

/**
 * 可控对象
 */
class CtrlObject extends LabelObject {

    /**
     * 显示名称
     */
    public displayName: string = "";

    /**
     * 颜色
     */
    public color: number[] = [.5, .5, .5];

    /**
     * 是否显示
     */
    public display: boolean = true;

    /**
     * 是否更新
     */
    public update: boolean = true;

    /**
     * 唯一标识符
     */
    public id: ObjectID;
    
    /**
     * 控制模型
     */
    protected model: Model;

    /**
     * 渲染数据
     */
    public renderParameter: IAnyObject = {};

    /**
     * 构造器
     */
    public constructor(model: Model) {
        super();
        this.model = model;
        this.id = uuid();
    }

    /**
     * 移除
     */
    public delete() {
        this.model.deleteObject([this]);
    }

    /**
     * 判断是否为相同对象
     */
    public equal(obj?: CtrlObject): boolean {
        return this === obj || this.id === obj?.id;
    }

    /**
     * 标记对象被删除
     */
    public markDelete() {
        this.deleteFlag = true;
    };

    /**
     * 删除标记
     */
    private deleteFlag: boolean = false;

    /**
     * 检测是否被删除
     */
    public testDelete() {
        for (let i = 0; i < this.model.objectPool.length; i++) {
            if (this.model.objectPool[i].equal(this)) {
                this.deleteFlag = false;
                return;
            }
        }
        this.deleteFlag = true;
    }

    /**
     * 是否被删除
     */
    public isDeleted(): boolean {
        return this.deleteFlag;
    }

    public toArchive<T>(): IArchiveCtrlObject & T {
        return {
            displayName: this.displayName,
            color: this.color.concat([]),
            display: !!this.display,
            update: !!this.update,
            id: this.id,
            renderParameter: parameter2ArchiveObject(this.renderParameter),
            deleteFlag: !!this.deleteFlag
        } as any;
    }

    public fromArchive<T>(archive: IArchiveCtrlObject & T, paster?: IArchiveParseFn): void {
        this.displayName = archive.displayName;
        this.color = archive.color.concat([]);
        this.display = !!archive.display;
        this.update = !!archive.update;
        this.id = archive.id;
        this.renderParameter = archiveObject2Parameter(
            archive.renderParameter, paster ?? (() => undefined)
        );
        this.deleteFlag = !!archive.deleteFlag;
    }
}

export { CtrlObject, IArchiveCtrlObject };