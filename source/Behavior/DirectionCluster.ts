import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IDirectionClusterBehaviorParameter = {
    cluster: "CLG",
	strength: "number",
    range: "number"
}

type IDirectionClusterBehaviorEvent = {}

class DirectionCluster extends Behavior<IDirectionClusterBehaviorParameter, IDirectionClusterBehaviorEvent> {

    public override behaviorId: string = "DirectionCluster";

    public override behaviorName: string = "$Title";

    public override iconName: string = "RawSource";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

    public override parameterOption = {
        cluster: { name: "$Cluster", type: "CLG" },
        strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 },
        range: { type: "number", name: "$Range", defaultValue: 4, numberMin: 0, numberStep: .1 }
    };

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        
        let findCount = 0;
        let centerDir: number[] = [0, 0, 0];

        for (let i = 0; i < this.parameter.cluster.objects.length; i++) {
            const targetGroup = this.parameter.cluster.objects[i];

            targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

				if (dis <= this.parameter.range) {
                    centerDir[0] += targetIndividual.velocity[0];
                    centerDir[1] += targetIndividual.velocity[1];
                    centerDir[2] += targetIndividual.velocity[2];
					findCount ++;
				}
			});
        }

        if (findCount > 0) {

            let length = individual.vectorLength(centerDir);

            if (length) {
                individual.applyForce(
                    centerDir[0] * this.parameter.strength / length,
                    centerDir[1] * this.parameter.strength / length,
                    centerDir[2] * this.parameter.strength / length
                );
            }
        }
    }

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "方向结群",
            "EN_US": "Directional clustering"
        },
        "$Intro": {
            "ZH_CN": "个体将按照视野范围内目标方向结群对象个体的平均移动方向移动",
            "EN_US": "Individuals will move according to the average moving direction of the grouped object individuals in the target direction within the field of vision"
        },
        "$Cluster": {
            "ZH_CN": "方向结群对象",
            "EN_US": "Directional clustering object"
        },
        "$Strength": {
            "ZH_CN": "结群强度",
            "EN_US": "Clustering strength"
        },
        "$Range": {
            "ZH_CN": "视野范围",
            "EN_US": "Field of vision"
        }
    };
}

export { DirectionCluster };