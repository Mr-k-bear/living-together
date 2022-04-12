import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IContactAttackingBehaviorParameter = {
    target: "CLG",
	success: "number",
    range: "number"
}

type IContactAttackingBehaviorEvent = {}

class ContactAttacking extends Behavior<IContactAttackingBehaviorParameter, IContactAttackingBehaviorEvent> {

    public override behaviorId: string = "ContactAttacking";

    public override behaviorName: string = "$Title";

    public override iconName: string = "DefenderTVM";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

	public override parameterOption = {
		target: { type: "CLG", name: "$Target" },
        range: { type: "number", name: "$Range", defaultValue: .05, numberMin: 0, numberStep: .01 },
        success: { type: "number", name: "$Success", defaultValue: 90, numberMin: 0, numberMax: 100, numberStep: 5 }
	};

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

        for (let i = 0; i < this.parameter.target.objects.length; i++) {
			const targetGroup = this.parameter.target.objects[i];

			targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

                // 进入攻击范围
				if (dis <= this.parameter.range) {
					
                    // 成功判定
                    if (Math.random() * 100 < this.parameter.success) {
                        targetIndividual.die();
                    }
				}
			});
		}
    }

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "接触攻击",
            "EN_US": "Contact Attacking"
        },
		"$Target": {
			"ZH_CN": "攻击目标",
			"EN_US": "Attacking target"
		},
        "$Range": {
            "ZH_CN": "攻击范围 (m)",
			"EN_US": "Attacking range (m)"
        },
		"$Success": {
			"ZH_CN": "成功率 (%)",
			"EN_US": "Success rate (%)"
		},
        "$Intro": {
            "ZH_CN": "攻击进入共进范围的目标群个体",
            "EN_US": "Attack the target group and individual entering the range"
        }
    };
}

export { ContactAttacking };