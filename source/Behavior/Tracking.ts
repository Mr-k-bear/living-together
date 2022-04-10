import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ITrackingBehaviorParameter = {
    target: "LG",
	strength: "number"
}

type ITrackingBehaviorEvent = {}

class Tracking extends Behavior<ITrackingBehaviorParameter, ITrackingBehaviorEvent> {

    public override behaviorId: string = "Tracking";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Bullseye";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

	public override parameterOption = {
		target: { type: "CLG", name: "$Target" },
		strength: { type: "number", name: "$Strength", defaultValue: 10, numberMin: 0, numberStep: .1 }
	};

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
		let target: Individual | undefined;
		let currentDistant: number = Infinity;

		for (let i = 0; i < this.parameter.target.objects.length; i++) {
			const targetGroup = this.parameter.target.objects[i];

			targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

				if (dis < currentDistant) {
					target = targetIndividual;
					currentDistant = dis;
				}

			});
		}

		if (target) {
			individual.applyForce(
				(target.position[0] - individual.position[0]) * this.parameter.strength,
				(target.position[1] - individual.position[1]) * this.parameter.strength,
				(target.position[2] - individual.position[2]) * this.parameter.strength
			);
		}
    }

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "追踪",
            "EN_US": "Tracking"
        },
		"$Target": {
			"ZH_CN": "追踪目标",
			"EN_US": "Tracking target"
		},
		"$Strength": {
			"ZH_CN": "追踪强度系数",
			"EN_US": "Tracking intensity coefficient"
		},
        "$Intro": {
            "ZH_CN": "个体将主动向最近的目标群个体发起追踪",
            "EN_US": "The individual will actively initiate tracking to the nearest target group individual"
        },
		"$Interactive": {
			"ZH_CN": "交互",
            "EN_US": "Interactive"
		}
    };
}

export { Tracking };