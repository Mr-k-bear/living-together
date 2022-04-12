import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IDelayAssimilateBehaviorParameter = {
    target: "CG",
    maxDelay: "number",
	minDelay: "number",
	success: "number"
}

type IDelayAssimilateBehaviorEvent = {}

class DelayAssimilate extends Behavior<IDelayAssimilateBehaviorParameter, IDelayAssimilateBehaviorEvent> {

    public override behaviorId: string = "DelayAssimilate";

    public override behaviorName: string = "$Title";

    public override iconName: string = "FunctionalManagerDashboard";

    public override describe: string = "$Intro";

	public override category: string = "$Initiative";

	public override parameterOption = {
        target: { type: "CG", name: "$Target" },
		maxDelay: { type: "number", name: "$Max.Delay", defaultValue: 20, numberStep: 1, numberMin: 0 },
		minDelay: { type: "number", name: "$Min.Delay", defaultValue: 5, numberStep: 1, numberMin: 0 },
		success: { type: "number", name: "$Success", defaultValue: 90, numberStep: 5, numberMin: 0 }
	};

	public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

        let assimilateGroup = this.parameter.target.objects;
        if (!assimilateGroup) return;
        
        const {maxDelay, minDelay, success} = this.parameter;

		let nextTime = individual.getData("DelayAssimilate.nextTime") ?? 
		minDelay +  Math.random() * (maxDelay - minDelay);
		let currentTime = individual.getData("DelayAssimilate.currentTime") ?? 0;
		
		currentTime += t;
		if (currentTime > nextTime) {
		
            // 成功判定
            if (Math.random() * 100 < success) {
                individual.transfer(assimilateGroup);
                nextTime = undefined;
                currentTime = undefined;
            } else {

                nextTime = minDelay +  Math.random() * (maxDelay - minDelay);
			    currentTime = 0;
            }
		}

		individual.setData("DelayAssimilate.nextTime", nextTime);
		individual.setData("DelayAssimilate.currentTime", currentTime);
	}

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "延迟同化",
            "EN_US": "Delayed assimilation"
        },
        "$Intro": {
            "ZH_CN": "随着时间的推移，个体逐渐向另一个群同化。",
            "EN_US": "Over time, individuals gradually assimilate to another group."
        },
        "$Target": {
            "ZH_CN": "同化目标",
            "EN_US": "Assimilation target"
        },
		"$Max.Delay": {
            "ZH_CN": "最长时间",
            "EN_US": "Longest time"
        },
		"$Min.Delay": {
            "ZH_CN": "最短时间",
            "EN_US": "Shortest time"
        },
		"$Success": {
            "ZH_CN": "成功率",
            "EN_US": "Minimum strength"
        },
        "$Initiative": {
            "ZH_CN": "主动",
            "EN_US": "Initiative"
        }
    };
}

export { DelayAssimilate };