import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IContactAssimilateBehaviorParameter = {
    target: "CLG",
    assimilate: "CG",
	success: "number",
    range: "number"
}

type IContactAssimilateBehaviorEvent = {}

class ContactAssimilate extends Behavior<IContactAssimilateBehaviorParameter, IContactAssimilateBehaviorEvent> {

    public override behaviorId: string = "ContactAssimilate";

    public override behaviorName: string = "$Title";

    public override iconName: string = "SyncStatus";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

	public override parameterOption = {
		target: { type: "CLG", name: "$Target" },
        assimilate: { type: "CG", name: "$Assimilate" },
        range: { type: "number", name: "$Range", defaultValue: .05, numberMin: 0, numberStep: .01 },
        success: { type: "number", name: "$Success", defaultValue: 90, numberMin: 0, numberMax: 100, numberStep: 5 }
	};

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

        let assimilateGroup = this.parameter.assimilate.objects;
        if (!assimilateGroup) return;

        for (let i = 0; i < this.parameter.target.objects.length; i++) {
			const targetGroup = this.parameter.target.objects[i];

			targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

                // 进入同化范围
				if (dis <= this.parameter.range) {
					
                    // 成功判定
                    if (Math.random() * 100 < this.parameter.success) {
                        targetIndividual.transfer(assimilateGroup!);
                    }
				}
			});
		}
    }

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "接触同化",
            "EN_US": "Contact Assimilate"
        },
		"$Target": {
			"ZH_CN": "从哪个群...",
			"EN_US": "From group..."
		},
        "$Assimilate": {
            "ZH_CN": "到哪个群...",
			"EN_US": "To group..."
        },
        "$Range": {
            "ZH_CN": "同化范围 (m)",
			"EN_US": "Assimilate range (m)"
        },
		"$Success": {
			"ZH_CN": "成功率 (%)",
			"EN_US": "Success rate (%)"
		},
        "$Intro": {
            "ZH_CN": "将进入同化范围内的个体同化至另一个群",
            "EN_US": "Assimilate individuals who enter the assimilation range to another group"
        }
    };
}

export { ContactAssimilate };