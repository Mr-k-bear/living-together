import { CtrlObject } from "@Model/CtrlObject";
import { Model, ObjectID } from "@Model/Model";
import { getDefaultValue } from "@Model/Parameter";

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

    public constructor(model: Model, id: ObjectID) {

        super(model, id);
        
        if (model.renderer) {
            this.renderParameter = getDefaultValue(model.renderer.cubeParameterOption);
        }
    }

}

export default Range;
export { Range }; 