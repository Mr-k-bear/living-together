import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IBrownianBehaviorParameter = {
    maxFrequency: "number",
	minFrequency: "number",
	maxStrength: "number",
	minStrength: "number",
	dirLimit: "boolean",
	angle: "number"
}

type IBrownianBehaviorEvent = {}

class Brownian extends Behavior<IBrownianBehaviorParameter, IBrownianBehaviorEvent> {

    public override behaviorId: string = "Brownian";

    public override behaviorName: string = "$Title";

    public override iconName: string = "ScatterChart";

    public override describe: string = "$Intro";

	public override category: string = "$Physics";

	public override parameterOption = {
		maxFrequency: { type: "number", name: "$Max.Frequency", defaultValue: 5, numberStep: .1, numberMin: 0 },
		minFrequency: { type: "number", name: "$Min.Frequency", defaultValue: 0, numberStep: .1, numberMin: 0 },
		maxStrength: { type: "number", name: "$Max.Strength", defaultValue: 10, numberStep: .01, numberMin: 0 },
		minStrength: { type: "number", name: "$Min.Strength", defaultValue: 0, numberStep: .01, numberMin: 0 },
		dirLimit: { type: "boolean", name: "$Direction.Limit", defaultValue: false },
		angle: {
			type: "number", name: "$Angle", defaultValue: 180, numberStep: 5,
			numberMin: 0, numberMax: 360, condition: { key: "dirLimit", value: true }
		}
	};

	private randomFocus360(): number[] {
		let randomVec = [
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		];

		let randomVecLen = (randomVec[0] ** 2 + randomVec[1] ** 2 + randomVec[2] ** 2) ** 0.5;
		return [randomVec[0] / randomVecLen, randomVec[1] / randomVecLen, randomVec[2] / randomVecLen];
	}

	private rotateWithVec(vec: number[], r: number[], ang: number) {

		const cos = Math.cos(ang); const sin = Math.sin(ang);
		const a1 = r[0] ?? 0; const a2 = r[1] ?? 0; const a3 = r[2] ?? 0; 

		return [
			(cos + (1 - cos) * a1 * a1) * (vec[0] ?? 0) +
			((1 - cos) * a1 * a2 - sin * a3) * (vec[1] ?? 0) +
			((1 - cos) * a1 * a3 + sin * a2) * (vec[2] ?? 0),

			((1 - cos) * a1 * a2 + sin * a3) * (vec[0] ?? 0) +
			(cos + (1 - cos) * a2 * a2) * (vec[1] ?? 0) +
			((1 - cos) * a2 * a3 - sin * a1) * (vec[2] ?? 0),

			((1 - cos) * a1 * a3 - sin * a2) * (vec[0] ?? 0) +
			((1 - cos) * a2 * a3 + sin * a1) * (vec[1] ?? 0) +
			(cos + (1 - cos) * a3 * a3) * (vec[2] ?? 0)
		]
	}
	private angle2Vector(v1: number[], v2: number[]): number {
		return Math.acos(
			(v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) /
			(
				(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2) ** 0.5 *
				(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2) ** 0.5
			)
		) * 180 / Math.PI;
	}

	private randomFocusRange(dir: number[], angle: number): number[] {

		// 计算 X-Z 投影
		let pxz = [dir[0] ?? 0, 0, dir[2] ?? 0];

		// 通过叉乘计算垂直向量
		let dxz: number[];

		// 如果投影向量没有长度，使用单位向量
		if (pxz[0] ** 2 + pxz[2] ** 2 === 0) {
			dxz = [0, 0, 1];
		}

		// 通过叉乘计算垂直轴线
		else {
			dxz = [
				dir[1] * pxz[2] - pxz[1] * dir[2],
				dir[2] * pxz[0] - pxz[2] * dir[0],
				dir[0] * pxz[1] - pxz[0] * dir[1]
			];

			let lenDxz = (dxz[0] ** 2 + dxz[1] ** 2 + dxz[2] ** 2) ** 0.5;
			dxz = [dxz[0] / lenDxz, dxz[1] / lenDxz, dxz[2] / lenDxz];
		}

		// 航偏角 360 随机旋转
		let randomH = this.rotateWithVec(dxz, dir, Math.random() * Math.PI * 2);

		// 俯仰角 180 * R 随机旋转
		let randomP = this.rotateWithVec(dir, randomH, (Math.random() - 0.5) * 2 * angle * Math.PI / 180);
		
		return randomP;
	}

	public effect = (individual: Individual, group: Group, model: Model, t: number): void => {

		const {maxFrequency, minFrequency, maxStrength, minStrength} = this.parameter;

		let nextTime = individual.getData("Brownian.nextTime") ?? 
		minFrequency +  Math.random() * (maxFrequency - minFrequency);
		let currentTime = individual.getData("Brownian.currentTime") ?? 0;
		
		currentTime += t;
		if (currentTime > nextTime) {

			let randomDir: number[];

			// 开启角度限制
			if (this.parameter.dirLimit) {

				// 计算当前速度大小
				const vLen = individual.vectorLength(individual.velocity);

				// 随机旋转算法
				if (vLen > 0) {
					randomDir = this.randomFocusRange(
						[
							individual.velocity[0] / vLen,
							individual.velocity[1] / vLen,
							individual.velocity[2] / vLen
						],
						this.parameter.angle / 2
					);

					if (isNaN(randomDir[0]) || isNaN(randomDir[1]) || isNaN(randomDir[2])) {
						randomDir = this.randomFocus360()
					}
				}

				else {
					randomDir = this.randomFocus360()
				}
			}
			
			// 随机生成算法
			else {
				randomDir = this.randomFocus360()
			}

			const randomLength = minStrength + Math.random() * (maxStrength - minStrength);

			individual.applyForce(
				randomDir[0] * randomLength,
				randomDir[1] * randomLength,
				randomDir[2] * randomLength
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
        },
		"$Direction.Limit": {
			"ZH_CN": "开启角度限制",
            "EN_US": "Enable limit angle"
		},
		"$Angle": {
			"ZH_CN": "限制立体角 (deg)",
            "EN_US": "Restricted solid angle (deg)"
		}
    };
}

export { Brownian };