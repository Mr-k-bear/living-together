import { CtrlObject, IArchiveCtrlObject } from "@Model/CtrlObject";
import { Model } from "@Model/Model";
import { getDefaultValue, IArchiveParseFn, parameter2ArchiveObject } from "@Model/Parameter";

interface IArchiveRange {
    position: Range["position"];
    radius: Range["radius"];
}

/**
 * 范围
 */
class Range extends CtrlObject {

    /**
     * 坐标
     */
    public position: number[] = [0, 0, 0];

    /**
     * 半径
     */
    public radius: number[] = [1, 1, 1];

    public constructor(model: Model) {

        super(model);
        
        if (model.renderer) {
            this.renderParameter = getDefaultValue(model.renderer.cubeParameterOption);
        }
    }

    public override toArchive<T>(): IArchiveCtrlObject & T {
        return {
            ...super.toArchive(),
            position: this.position.concat([]),
            radius: this.radius.concat([])
        };
    }

    public override fromArchive<T>(archive: IArchiveCtrlObject & T, paster?: IArchiveParseFn): void {
        super.fromArchive(archive, paster);
        this.position = (archive as any).position.concat([]),
        this.radius = (archive as any).radius.concat([])
    }

}

export { Range, IArchiveRange }; 