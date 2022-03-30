import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Label } from "@Model/Label";
import { Model } from "@Model/Model";
import { Range } from "@Model/Range";

type IBoundaryConstraintBehaviorParameter = {
    range: "LR"
}

type IBoundaryConstraintBehaviorEvent = {}

class BoundaryConstraint extends Behavior<IBoundaryConstraintBehaviorParameter, IBoundaryConstraintBehaviorEvent> {

    public override behaviorId: string = "BoundaryConstraint";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Running";

    public override describe: string = "$Intro";

    public override category: string = "$Physics";

	public override parameterOption = {
		range: {
			type: "LR",
			name: "$range",
			defaultValue: undefined
		}
	};

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "边界约束",
            "EN_US": "Boundary constraint"
        },
        "$Intro": {
            "ZH_CN": "个体越出边界后将主动返回",
            "EN_US": "Individuals will return actively after crossing the border"
        }
    };

    public effect(individual: Individual, group: Group, model: Model, t: number): void {
        let rangeList: Range[] = [];
		if (this.parameter.range instanceof Range) {
			rangeList.push(this.parameter.range);
		}
		if (this.parameter.range instanceof Label) {
			rangeList = model.getObjectByLabel(this.parameter.range).filter((obj) => {
				return obj instanceof Range
			}) as any;
		}
		for (let i = 0; i < rangeList.length; i++) {

			let rx = rangeList[i].position[0] - individual.position[0];
			let ry = rangeList[i].position[1] - individual.position[1];
			let rz = rangeList[i].position[2] - individual.position[2];

			let ox = Math.abs(rx) > rangeList[i].radius[0];
			let oy = Math.abs(ry) > rangeList[i].radius[1];
			let oz = Math.abs(rz) > rangeList[i].radius[2];

			individual.applyForce(
				ox ? rx : 0,
				oy ? ry : 0,
				oz ? rz : 0
			)
		}
    }
}

export { BoundaryConstraint };