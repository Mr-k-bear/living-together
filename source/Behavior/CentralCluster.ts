import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ICentralClusterBehaviorParameter = {
    cluster: "CLG",
	strength: "number",
    range: "number"
}

type ICentralClusterBehaviorEvent = {}

class CentralCluster extends Behavior<ICentralClusterBehaviorParameter, ICentralClusterBehaviorEvent> {

    public override behaviorId: string = "CentralCluster";

    public override behaviorName: string = "$Title";

    public override iconName: string = "ZoomToFit";

    public override describe: string = "$Intro";

    public override category: string = "$Interactive";

    public override parameterOption = {
        cluster: { name: "$Cluster", type: "CLG" },
        strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 },
        range: { type: "number", name: "$Range", defaultValue: 4, numberMin: 0, numberStep: .1 }
    };

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        
        let findCount = 0;
        let centerPos: number[] = [0, 0, 0];

        for (let i = 0; i < this.parameter.cluster.objects.length; i++) {
            const targetGroup = this.parameter.cluster.objects[i];

            targetGroup.individuals.forEach((targetIndividual) => {

				// 排除自己
				if (targetIndividual === individual) return;
				let dis = targetIndividual.distanceTo(individual);

				if (dis <= this.parameter.range) {
                    centerPos[0] += targetIndividual.position[0];
                    centerPos[1] += targetIndividual.position[1];
                    centerPos[2] += targetIndividual.position[2];
					findCount ++;
				}
			});
        }

        if (findCount > 0) {

            let dirX = centerPos[0] / findCount - individual.position[0];
            let dirY = centerPos[1] / findCount - individual.position[1];
            let dirZ = centerPos[2] / findCount - individual.position[2];
            let length = individual.vectorLength(dirX, dirY, dirZ);

            if (length > 0) {
                individual.applyForce(
                    dirX * this.parameter.strength / length,
                    dirY * this.parameter.strength / length,
                    dirZ * this.parameter.strength / length
                );
            }
        }
    }

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "中心结群",
            "EN_US": "Central cluster"
        },
        "$Intro": {
            "ZH_CN": "个体将按照视野范围内目标方向结群对象个体的几何中心移动",
            "EN_US": "The individual will move according to the geometric center of the grouped object individual in the target direction within the field of view"
        },
        "$Cluster": {
            "ZH_CN": "中心结群对象",
            "EN_US": "Central clustering object"
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

export { CentralCluster };