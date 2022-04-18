import { Emitter, EventType } from "@Model/Emitter";
import { Model } from "./Model";

interface IArchiveEvent {
    fileChange: Archive;
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
        let fileData: Record<string, any> = {};
        
        // 保存对象
        fileData.objects = [];
        
        // 记录
        model.objectPool.map((object) => {

        })

        return JSON.stringify(model);
    }

    /**
     * 加载文件为模型
     * return Model
     */
    public load(model: Model, data: string) {};
}

export { Archive };
export default Archive;