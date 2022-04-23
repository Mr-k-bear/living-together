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
class Range extends CtrlObject<IArchiveRange> {

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

    public override toArchive(): IArchiveCtrlObject & IArchiveRange {
        return {
            ...super.toArchive(),
            objectType: "R",
            position: this.position.concat([]),
            radius: this.radius.concat([])
        };
    }

    public override fromArchive(archive: IArchiveCtrlObject & IArchiveRange, paster: IArchiveParseFn): void {
        super.fromArchive(archive, paster);
        this.position = archive.position.concat([]),
        this.radius = archive.radius.concat([])
    }

}

export { Range, IArchiveRange }; 