import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ISampleTrackingBehaviorParameter = {
    target: "CLG",
    key: "string",
	strength: "number",
    range: "number",
    angle: "number",
    accuracy: "number"
}

type ISampleTrackingBehaviorEvent = {}

class SampleTracking extends Behavior<ISampleTrackingBehaviorParameter, ISampleTrackingBehaviorEvent> {

    public override behaviorId: string = "SampleTracking";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Video360Generic";

    public override describe: string = "$Intro";

    public override category: string = "$Initiative";

	public override parameterOption = {
		target: { type: "CLG", name: "$Target" },
        key: { type: "string", name: "$Key"},
        range: { type: "number", name: "$Range", defaultValue: 4, numberMin: 0, numberStep: .1 },
        angle: { type: "number", name: "$Angle", defaultValue: 180, numberMin: 0, numberMax: 360, numberStep: 5 },
		strength: { type: "number", name: "$Strength", defaultValue: 1, numberMin: 0, numberStep: .1 },
        accuracy: { type: "number", name: "$Accuracy", defaultValue: 5, numberMin: 0, numberMax: 180, numberStep: 1 }
	};

    private angle2Vector(v1: number[], v2: number[]): number {
		return Math.acos(
			(v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) /
			(
				(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2) ** 0.5 *
				(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2) ** 0.5
			)
		) * 180 / Math.PI;
	}

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

        const dirArr: number[][] = []; const valArr: number[] = [];

        for (let i = 0; i < this.parameter.target.objects.length; i++) {
            const targetGroup = this.parameter.target.objects[i];

			targetGroup.individuals.forEach((targetIndividual) => {

                // 计算距离
                let dis = targetIndividual.distanceTo(individual);
                if (dis > this.parameter.range) return;

                // 计算方向
                let targetDir = [
                    targetIndividual.position[0] - individual.position[0],
                    targetIndividual.position[1] - individual.position[1],
                    targetIndividual.position[2] - individual.position[2]
                ];

                // 计算视线角度
                let angle = this.angle2Vector(individual.velocity, targetDir);

                // 在可视角度内
                if (angle < (this.parameter.angle ?? 360) / 2) {

                    // 采样
                    let isFindNest = false;
                    for (let i = 0; i < valArr.length; i++) {

                        // 计算采样角度
                        let sampleAngle = this.angle2Vector(dirArr[i], targetDir);

                        // 小于采样精度，合并
                        if (sampleAngle < this.parameter.accuracy ?? 5) {
                            dirArr[i][0] += targetDir[0];
                            dirArr[i][1] += targetDir[1];
                            dirArr[i][2] += targetDir[2];
                            valArr[i] += targetIndividual.getData(this.parameter.key) ?? 0;
                            isFindNest = true;
                        }
                    }

                    if (!isFindNest) {

                        // 保存
                        dirArr.push(targetDir);
                        valArr.push(targetIndividual.getData(this.parameter.key) ?? 0);
                    }
                }
            });
        }

        // 计算最大方向
        let maxVal = -1; let maxDir: number[] | undefined;
        for (let i = 0; i < valArr.length; i++) {
            if (valArr[i] > maxVal) {
                maxVal = valArr[i];
                maxDir = dirArr[i];
            }
        }

        if (maxDir) {
            const dir = individual.vectorNormalize(maxDir);
            individual.applyForce(
                dir[0] * this.parameter.strength,
                dir[1] * this.parameter.strength,
                dir[2] * this.parameter.strength
            );
        }
    }

	public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "采样追踪",
            "EN_US": "Sample tracking"
        },
		"$Target": {
			"ZH_CN": "追踪目标",
			"EN_US": "Tracking target"
		},
        "$Key": {
            "ZH_CN": "计算键值",
			"EN_US": "Calculate key value"
        },
        "$Accuracy": {
            "ZH_CN": "采样精度",
			"EN_US": "Sampling accuracy"
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
            "ZH_CN": "个体将主动向目标个体较多的方向发起追踪",
            "EN_US": "Individuals will actively initiate tracking in the direction of more target individuals"
        },
		"$Interactive": {
			"ZH_CN": "交互",
            "EN_US": "Interactive"
		},
        "$Angle": {
            "ZH_CN": "可视角度",
            "EN_US": "Viewing angle"
        }
    };
}

export { SampleTracking };