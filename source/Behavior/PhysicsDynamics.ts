import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IPhysicsDynamicsBehaviorParameter = {
    mass: "number",
	maxAcceleration: "number",
	maxVelocity: "number",
	resistance: "number",
	limit: "boolean"
}

type IPhysicsDynamicsBehaviorEvent = {}

class PhysicsDynamics extends Behavior<IPhysicsDynamicsBehaviorParameter, IPhysicsDynamicsBehaviorEvent> {

    public override behaviorId: string = "PhysicsDynamics";

    public override behaviorName: string = "$Title";

    public override iconName: string = "SliderHandleSize";

    public override describe: string = "$Intro";

	public override category: string = "$Physics";

	public override parameterOption = {
		mass: { name: "$Mass", type: "number", defaultValue: 1, numberStep: .01, numberMin: .001 },
		resistance: { name: "$Resistance", type: "number", defaultValue: 2.8, numberStep: .1, numberMin: 0 },
		limit: { name: "$Limit", type: "boolean", defaultValue: true },
		maxAcceleration: {
			name: "$Max.Acceleration", type: "number", defaultValue: 6.25, 
			numberStep: .1, numberMin: 0, condition: { key: "limit", value: true }
		},
		maxVelocity: {
			name: "$Max.Velocity", type: "number", defaultValue: 12.5,
			numberStep: .1, numberMin: 0, condition: { key: "limit", value: true }
		},
	};

	public override finalEffect = (individual: Individual, group: Group, model: Model, t: number): void => {

		// 计算当前速度
		const currentV = individual.vectorLength(individual.velocity);

		// 计算阻力
		const resistance = currentV * currentV * this.parameter.resistance;

		// 应用阻力
		if (currentV) {
			individual.applyForce(
				(- individual.velocity[0] / currentV) * resistance,
				(- individual.velocity[1] / currentV) * resistance,
				(- individual.velocity[2] / currentV) * resistance
			);
		}
		
		// 计算加速度
		individual.acceleration[0] = individual.force[0] / this.parameter.mass;
		individual.acceleration[1] = individual.force[1] / this.parameter.mass;
		individual.acceleration[2] = individual.force[2] / this.parameter.mass;

		// 加速度约束
		if (this.parameter.limit) {
			const lengthA = individual.vectorLength(individual.acceleration);
			if (lengthA > this.parameter.maxAcceleration) {
				individual.acceleration[0] = individual.acceleration[0] * this.parameter.maxAcceleration / lengthA;
				individual.acceleration[1] = individual.acceleration[1] * this.parameter.maxAcceleration / lengthA;
				individual.acceleration[2] = individual.acceleration[2] * this.parameter.maxAcceleration / lengthA;
			}
		}
		
		// 计算速度
		individual.velocity[0] = individual.velocity[0] + individual.acceleration[0] * t;
		individual.velocity[1] = individual.velocity[1] + individual.acceleration[1] * t;
		individual.velocity[2] = individual.velocity[2] + individual.acceleration[2] * t;

		// 速度约束
		if (this.parameter.limit) {
			const lengthV = individual.vectorLength(individual.velocity);
			if (lengthV > this.parameter.maxVelocity) {
				individual.velocity[0] = individual.velocity[0] * this.parameter.maxVelocity / lengthV;
				individual.velocity[1] = individual.velocity[1] * this.parameter.maxVelocity / lengthV;
				individual.velocity[2] = individual.velocity[2] * this.parameter.maxVelocity / lengthV;
			}
		}

		// 应用速度
		individual.position[0] = individual.position[0] + individual.velocity[0] * t;
		individual.position[1] = individual.position[1] + individual.velocity[1] * t;
		individual.position[2] = individual.position[2] + individual.velocity[2] * t;

		// 清除受力
		individual.force[0] = 0;
		individual.force[1] = 0;
		individual.force[2] = 0;
	};
	
    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "物理动力学",
            "EN_US": "Physics dynamics"
        },
        "$Intro": {
            "ZH_CN": "一切按照物理规则运动物体的行为, 按照牛顿经典物理运动公式执行。",
            "EN_US": "The behavior of all moving objects according to physical rules is carried out according to Newton's classical physical motion formula."
        },
		"$Limit": {
			"ZH_CN": "开启限制",
            "EN_US": "Enable limit"
		},
		"$Mass": {
			"ZH_CN": "质量 (Kg)",
            "EN_US": "Mass (Kg)"
		},
		"$Max.Acceleration": {
			"ZH_CN": "最大加速度 (m/s²)",
            "EN_US": "Maximum acceleration (m/s²)"
		},
		"$Max.Velocity": {
			"ZH_CN": "最大速度 (m/s)",
            "EN_US": "Maximum velocity (m/s)"
		},
		"$Resistance": {
			"ZH_CN": "阻力系数",
			"EN_US": "Resistance coefficient"
		},
		"$Physics": {
			"ZH_CN": "物理",
            "EN_US": "Physics"
		}
    };
}

export { PhysicsDynamics };