import { Emitter, EventType } from "@Model/Emitter";
import { IArchiveCtrlObject } from "@Model/CtrlObject";
import { Model } from "@Model/Model";
import { IArchiveLabel } from "@Model/Label";

interface IArchiveEvent {
    fileChange: Archive;
}

interface IArchiveObject {
    nextIndividualId: number;
    objectPool: IArchiveCtrlObject[];
    labelPool: IArchiveLabel[];
}

class Archive<
    M extends any = any,
    E extends Record<EventType, any> = {}
> extends Emitter<E & IArchiveEvent> {

    /**
     * 是否为新文件
     */
    public isNewFile: boolean = true;

    /**
     * 文件名
     */
    public fileName?: string;

    /**
     * 是否保存
     */
    public isSaved: boolean = false;

    /**
     * 文件数据
     */
    public fileData?: M;

    /**
     * 保存文件
     * 模型转换为文件
     */
    public save(model: Model): string {

        // 存贮 CtrlObject
        const objectPool: IArchiveCtrlObject[] = [];
        model.objectPool.forEach(obj => {
            objectPool.push(obj.toArchive());
        })

        // 存储 Label
        const labelPool: IArchiveLabel[] = [];
        model.labelPool.forEach(obj => {
            labelPool.push(obj.toArchive());
        })

        const fileData: IArchiveObject = {
            nextIndividualId: model.nextIndividualId,
            objectPool: objectPool,
            labelPool: labelPool
        };

        console.log(fileData);
        console.log({value: JSON.stringify(fileData)});

        this.isSaved = true;
        this.emit( ...["fileChange", this] as any );

        return "";
    }

    /**
     * 加载文件为模型
     * return Model
     */
    public load(model: Model, data: string) {};
}

export { Archive };
export default Archive;