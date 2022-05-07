import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IAvoidanceBehaviorParameter = {
    avoid: "CLG",
	strength: "number",
    range: "number"
}

type IAvoidanceBehaviorEvent = {}

class Avoidance extends Behavior<IAvoidanceBehaviorParameter, IAvoidanceBehaviorEvent> {

    public override behaviorId: string = "Avoidance";

    public override behaviorName: string = "$Title";

    public override iconName: string = "FastMode";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

    public override parameterOption = {
        avoid: { name: "$Avoid", type: "CLG" },
        strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 },
        range: { type: "number", name: "$Range", defaultValue: 4, numberMin: 0, numberStep: .1 }
    };

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        
        let currentDistant: number = Infinity;
        let avoidTarget = undefined as Individual | undefined;

        for (let i = 0; i < this.parameter.avoid.objects.length; i++) {
            const targetGroup = this.parameter.avoid.objects[i];

            targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

				if (dis < currentDistant && dis <= this.parameter.range) {
					avoidTarget = targetIndividual;
					currentDistant = dis;
				}
			});
        }

        if (avoidTarget && currentDistant !== Infinity) {
            individual.applyForce(
				(individual.position[0] - avoidTarget.position[0]) * this.parameter.strength / currentDistant,
				(individual.position[1] - avoidTarget.position[1]) * this.parameter.strength / currentDistant,
				(individual.position[2] - avoidTarget.position[2]) * this.parameter.strength / currentDistant
			);
        }
    }

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "躲避",
            "EN_US": "Avoidance"
        },
        "$Intro": {
            "ZH_CN": "远离视野范围内最近的躲避目标",
            "EN_US": "Stay away from the nearest evasive target in the field of vision"
        },
        "$Avoid": {
            "ZH_CN": "躲避对象",
            "EN_US": "Avoid object"
        },
        "$Strength": {
            "ZH_CN": "躲避强度",
            "EN_US": "Avoidance intensity"
        },
        "$Range": {
            "ZH_CN": "视野范围",
            "EN_US": "Field of vision"
        }
    };
}

export { Avoidance };