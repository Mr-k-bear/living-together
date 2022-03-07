import { CtrlObject } from "./CtrlObject";

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

}

export default Range;
export { Range }; 