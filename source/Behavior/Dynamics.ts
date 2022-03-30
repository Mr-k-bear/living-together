import { Behavior } from "@Model/Behavior";
import Group from "@Model/Group";
import Individual from "@Model/Individual";
import { Model } from "@Model/Model";

type IDynamicsBehaviorParameter = {
    mass: "number",
	maxAcceleration: "number",
	maxVelocity: "number",
	resistance: "number"
}

type IDynamicsBehaviorEvent = {}

class Dynamics extends Behavior<IDynamicsBehaviorParameter, IDynamicsBehaviorEvent> {

    public override behaviorId: string = "Dynamics";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Running";

    public override describe: string = "$Intro";

	public override category: string = "$Physics";

	public override parameterOption = {
		mass: {
			name: "$Mass",
			type: "number",
			defaultValue: 1,
			numberStep: .01,
			numberMin: .001
		},
		maxAcceleration: {
			name: "$Max.Acceleration",
			type: "number",
			defaultValue: 0.5,
			numberStep: .01,
			numberMin: 0
		},
		maxVelocity: {
			name: "$Max.Velocity",
			type: "number",
			defaultValue: 0.5,
			numberStep: .01,
			numberMin: 0
		},
		resistance: {
			name: "$Resistance",
			type: "number",
			defaultValue: .01,
			numberStep: .001,
			numberMin: 0
		}
	};

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "动力学",
            "EN_US": "Dynamics"
        },
        "$Intro": {
            "ZH_CN": "一切可以运动物体的必要行为，执行物理法则。",
            "EN_US": "All necessary behaviors that can move objects and implement the laws of physics."
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
		"$Physics": {
			"ZH_CN": "物理",
            "EN_US": "Physics"
		}
    };

	public override finalEffect(individual: Individual, group: Group, model: Model, t: number): void {

		// 计算当前速度
		const currentV = individual.vectorLength(individual.velocity);

		// 计算阻力
		const resistance = Math.max(1 - currentV * currentV * this.parameter.resistance, 0);
		
		// 计算加速度
		individual.acceleration[0] = individual.force[0] * resistance / this.parameter.mass;
		individual.acceleration[1] = individual.force[1] * resistance / this.parameter.mass;
		individual.acceleration[2] = individual.force[2] * resistance / this.parameter.mass;

		// 加速度约束
		const overA = Math.max(individual.vectorLength(individual.acceleration) - this.parameter.maxAcceleration, 0);
		individual.acceleration[0] = individual.acceleration[0] - individual.acceleration[0] * overA;
		individual.acceleration[1] = individual.acceleration[1] - individual.acceleration[1] * overA;
		individual.acceleration[2] = individual.acceleration[2] - individual.acceleration[2] * overA;

		// 计算速度
		individual.velocity[0] = individual.velocity[0] + individual.acceleration[0] * t;
		individual.velocity[1] = individual.velocity[1] + individual.acceleration[1] * t;
		individual.velocity[2] = individual.velocity[2] + individual.acceleration[2] * t;

		// 速度约束
		const overV = Math.max(individual.vectorLength(individual.velocity) - this.parameter.maxVelocity, 0);
		individual.velocity[0] = individual.velocity[0] - individual.velocity[0] * overV;
		individual.velocity[1] = individual.velocity[1] - individual.velocity[1] * overV;
		individual.velocity[2] = individual.velocity[2] - individual.velocity[2] * overV;

		// 应用速度
		individual.position[0] = individual.position[0] + individual.velocity[0] * t;
		individual.position[1] = individual.position[1] + individual.velocity[1] * t;
		individual.position[2] = individual.position[2] + individual.velocity[2] * t;
	};
}

export { Dynamics };