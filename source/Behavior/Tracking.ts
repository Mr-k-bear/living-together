import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ITrackingBehaviorParameter = {
    target: "CLG",
	strength: "number",
    range: "number",
    lock: "boolean"
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
        lock: { type: "boolean", name: "$Lock", defaultValue: false },
        range: { type: "number", name: "$Range", defaultValue: 4, numberMin: 0, numberStep: .1 },
		strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 }
	};

    private target: Individual | undefined = undefined;
    private currentDistant: number = Infinity;

    private searchTarget(individual: Individual) {

		for (let i = 0; i < this.parameter.target.objects.length; i++) {
			const targetGroup = this.parameter.target.objects[i];

			targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

				if (dis < this.currentDistant && dis <= this.parameter.range) {
					this.target = targetIndividual;
					this.currentDistant = dis;
				}

			});
		}
    }

    private clearTarget() {
        this.target = undefined as Individual | undefined;
        this.currentDistant = Infinity;
    }

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

        this.clearTarget();

        if (this.parameter.lock) {

            let isValidTarget = false;
            this.target = individual.getData("Tracking.lock.target");

            if (this.target) {

                // 校验目标所在的群是否仍是目标
                let isInTarget = false;
                for (let i = 0; i < this.parameter.target.objects.length; i++) {
                    if (this.parameter.target.objects[i].equal(this.target.group)) {
                        isInTarget = true;
                        break;
                    }
                }

                // 如果还在目标范围内，校验距离
                if (isInTarget) {
                    let dis = individual.distanceTo(this.target);

                    // 校验成功
                    if (dis <= this.parameter.range) {
                        this.currentDistant = dis;
                        isValidTarget = true;
                    }
                }
            }

            // 如果目标无效，尝试搜索新的目标
            if (!isValidTarget) {

                this.clearTarget();
                this.searchTarget(individual);

                // 如果成功搜索，缓存目标
                if (this.target && this.currentDistant && this.currentDistant !== Infinity) {
                    individual.setData("Tracking.lock.target", this.target);
                }

                // 搜索失败，清除目标
                else {
                    individual.setData("Tracking.lock.target", undefined);
                }
            }
        }

        else {
            this.searchTarget(individual);
        }

		if (this.target && this.currentDistant && this.currentDistant !== Infinity) {
			individual.applyForce(
				(this.target.position[0] - individual.position[0]) * this.parameter.strength / this.currentDistant,
				(this.target.position[1] - individual.position[1]) * this.parameter.strength / this.currentDistant,
				(this.target.position[2] - individual.position[2]) * this.parameter.strength / this.currentDistant
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
        "$Lock": {
            "ZH_CN": "追踪锁定",
			"EN_US": "Tracking lock"
        },
        "$Range": {
            "ZH_CN": "追踪范围 (m)",
			"EN_US": "Tracking range (m)"
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