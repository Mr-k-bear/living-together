import { Emitter, EventType, EventMixin } from "./Emitter";

interface IArchiveEvent {
    save: Archive;
    load: Archive;
}

class Archive<
    M extends any = any,
    E extends Record<EventType, any> = {}
> extends Emitter<E> {

    /**
     * 是否为新文件
     */
    public isNewFile: boolean = true;

    /**
     * 文件名
     */
    public fileName?: string;

    /**
     * 文件数据
     */
    public fileData?: M;

    /**
     * 保存文件
     * 模型转换为文件
     */
    public save() {};

    /**
     * 加载文件为模型
     * return Model
     */
    public load() {};
}

export { Archive };
export default Archive;