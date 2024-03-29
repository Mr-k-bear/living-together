import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";
import { Range } from "@Model/Range";

type IBoundaryConstraintBehaviorParameter = {
    range: "LR",
	strength: "number"
}

type IBoundaryConstraintBehaviorEvent = {}

class BoundaryConstraint extends Behavior<IBoundaryConstraintBehaviorParameter, IBoundaryConstraintBehaviorEvent> {

    public override behaviorId: string = "BoundaryConstraint";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Quantity";

    public override describe: string = "$Intro";

    public override category: string = "$Physics";

	public override parameterOption = {
		range: { type: "LR", name: "$range" },
		strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 }
	};

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        let rangeList: Range[] = this.parameter.range.objects;

		let fx = 0;
		let fy = 0;
		let fz = 0;
		let fLen = Infinity;

		for (let i = 0; i < rangeList.length; i++) {

			let rx = rangeList[i].position[0] - individual.position[0];
			let ry = rangeList[i].position[1] - individual.position[1];
			let rz = rangeList[i].position[2] - individual.position[2];

			let ox = Math.abs(rx) > rangeList[i].radius[0];
			let oy = Math.abs(ry) > rangeList[i].radius[1];
			let oz = Math.abs(rz) > rangeList[i].radius[2];

			if (ox || oy || oz) {

				const backFocus: number[] = [0, 0, 0];

				if (ox) backFocus[0] = rx - rx * rangeList[i].radius[0] / Math.abs(rx);
				if (oy) backFocus[1] = ry - ry * rangeList[i].radius[1] / Math.abs(ry);
				if (oz) backFocus[2] = rz - rz * rangeList[i].radius[2] / Math.abs(rz);

				let currentFLen = individual.vectorLength(backFocus);
				if (currentFLen < fLen) {
					fx = backFocus[0];
					fy = backFocus[1];
					fz = backFocus[2];
					fLen = currentFLen;
				}

			} else {
				fx = 0;
				fy = 0;
				fz = 0;
				fLen = 0;
			}
		}

        if (fLen && fLen !== Infinity) {
            individual.applyForce(
                fx * this.parameter.strength / fLen,
                fy * this.parameter.strength / fLen,
                fz * this.parameter.strength / fLen
            );
        }
    }

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "边界约束",
            "EN_US": "Boundary constraint"
        },
		"$range": {
			"ZH_CN": "约束范围",
			"EN_US": "Constraint range"
		},
		"$Strength": {
			"ZH_CN": "约束强度系数",
			"EN_US": "Restraint strength coefficient"
		},
        "$Intro": {
            "ZH_CN": "个体越出边界后将主动返回",
            "EN_US": "Individuals will return actively after crossing the border"
        }
    };
}

export { BoundaryConstraint };