import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IBrownianBehaviorParameter = {
    maxFrequency: "number",
	minFrequency: "number",
	maxStrength: "number",
	minStrength: "number"
}

type IBrownianBehaviorEvent = {}

class Brownian extends Behavior<IBrownianBehaviorParameter, IBrownianBehaviorEvent> {

    public override behaviorId: string = "Brownian";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Running";

    public override describe: string = "$Intro";

	public override category: string = "$Physics";

	public override parameterOption = {
		maxFrequency: { type: "number", name: "$Max.Frequency", defaultValue: 5, numberStep: .1, numberMin: 0 },
		minFrequency: { type: "number", name: "$Min.Frequency", defaultValue: 0, numberStep: .1, numberMin: 0 },
		maxStrength: { type: "number", name: "$Max.Strength", defaultValue: 10, numberStep: .01, numberMin: 0 },
		minStrength: { type: "number", name: "$Min.Strength", defaultValue: 0, numberStep: .01, numberMin: 0 }
	};

	public effect(individual: Individual, group: Group, model: Model, t: number): void {

		const {maxFrequency, minFrequency, maxStrength, minStrength} = this.parameter;

		let nextTime = individual.getData("Brownian.nextTime") ?? 
		minFrequency +  Math.random() * (maxFrequency - minFrequency);
		let currentTime = individual.getData("Brownian.currentTime") ?? 0;
		
		currentTime += t;
		if (currentTime > nextTime) {
			individual.applyForce(
				minStrength + (Math.random() * 2 - 1) * (maxStrength - minStrength),
				minStrength + (Math.random() * 2 - 1) * (maxStrength - minStrength),
				minStrength + (Math.random() * 2 - 1) * (maxStrength - minStrength)
			);
			nextTime = minFrequency +  Math.random() * (maxFrequency - minFrequency);
			currentTime = 0;
		}

		individual.setData("Brownian.nextTime", nextTime);
		individual.setData("Brownian.currentTime", currentTime);
	}

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "布朗运动",
            "EN_US": "Brownian motion"
        },
        "$Intro": {
            "ZH_CN": "一种无规则的随机运动",
            "EN_US": "An irregular random motion"
        },
		"$Max.Frequency": {
            "ZH_CN": "最大频率",
            "EN_US": "Maximum frequency"
        },
		"$Min.Frequency": {
            "ZH_CN": "最小频率",
            "EN_US": "Minimum frequency"
        },
		"$Max.Strength": {
            "ZH_CN": "最大强度",
            "EN_US": "Maximum strength"
        },
		"$Min.Strength": {
            "ZH_CN": "最小强度",
            "EN_US": "Minimum strength"
        }
    };
}

export { Brownian };