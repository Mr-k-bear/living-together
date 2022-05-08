import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IManufactureBehaviorParameter = {
    maxFrequency: "number",
	minFrequency: "number",
	genTarget: "CG",
}

type IManufactureBehaviorEvent = {}

class Manufacture extends Behavior<IManufactureBehaviorParameter, IManufactureBehaviorEvent> {

    public override behaviorId: string = "Manufacture";

    public override behaviorName: string = "$Title";

    public override iconName: string = "ProductionFloorManagement";

    public override describe: string = "$Intro";

	public override category: string = "$Initiative";

	public override parameterOption = {
        genTarget: { type: "CG", name: "$Gen.Target" },
		maxFrequency: { type: "number", name: "$Max.Frequency", defaultValue: 5, numberStep: .1, numberMin: 0 },
		minFrequency: { type: "number", name: "$Min.Frequency", defaultValue: 0, numberStep: .1, numberMin: 0 }
	};

	public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

		const {genTarget, maxFrequency, minFrequency} = this.parameter;

        if (genTarget.objects) {
            
            let nextTime = individual.getData("Manufacture.nextTime") ?? 
            minFrequency + Math.random() * (maxFrequency - minFrequency);
            let currentTime = individual.getData("Manufacture.currentTime") ?? 0;

            if (currentTime > nextTime) {

                // 生成个体
                let newIndividual = genTarget.objects.new(1);
                newIndividual.position = individual.position.concat([]);
                
                nextTime = minFrequency +  Math.random() * (maxFrequency - minFrequency);
                currentTime = 0;
            }
            
            currentTime += t;

            individual.setData("Manufacture.nextTime", nextTime);
		    individual.setData("Manufacture.currentTime", currentTime);
        }
	}

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "生产",
            "EN_US": "Manufacture"
        },
        "$Intro": {
            "ZH_CN": "在指定的群创造新的个体",
            "EN_US": "Create new individuals in a given group"
        },
        "$Gen.Target": {
            "ZH_CN": "目标群",
            "EN_US": "Target group"
        },
		"$Max.Frequency": {
            "ZH_CN": "最大频率",
            "EN_US": "Maximum frequency"
        },
		"$Min.Frequency": {
            "ZH_CN": "最小频率",
            "EN_US": "Minimum frequency"
        }
    };
}

export { Manufacture };