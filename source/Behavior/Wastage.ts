import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type IWastageBehaviorParameter = {
    key: "string",
    value: "number",
    speed: "number",
    threshold: "number",
    kill: "boolean",
    assimilate: "CG"
}

type IWastageBehaviorEvent = {}

class Wastage extends Behavior<IWastageBehaviorParameter, IWastageBehaviorEvent> {

    public override behaviorId: string = "Wastage";

    public override behaviorName: string = "$Title";

    public override iconName: string = "BackgroundColor";

    public override describe: string = "$Intro";

    public override category: string = "$Initiative";

    public override parameterOption = {
        key: { type: "string", name: "$Key" },
        value: { type: "number", name: "$Value", defaultValue: 100, numberStep: 1 },
        speed: { type: "number", name: "$Speed", defaultValue: 1, numberStep: .1 },
        threshold: { type: "number", name: "$Threshold", defaultValue: 0, numberStep: 1 },
        kill: { type: "boolean", name: "$Kill", defaultValue: true },
        assimilate: { type: "CG", name: "$Assimilate", condition: { key: "kill", value: false } }
    };

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        const key = this.parameter.key;
        if (!key) return;
        
        let currentValue = individual.getData(`Wastage.${key}`) ?? this.parameter.value;
        currentValue -= this.parameter.speed * t;

        // 超过阈值
        if (currentValue < this.parameter.threshold) {

            currentValue = undefined;

            // 杀死个体
            if (this.parameter.kill) {
                individual.die();
            }

            // 开启同化
            else if (this.parameter.assimilate.objects) {
                individual.transfer(this.parameter.assimilate.objects);
            }
        }

        individual.setData(`Wastage.${key}`, currentValue);
    }

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "流逝",
            "EN_US": "Wastage"
        },
        "$Intro": {
            "ZH_CN": "随着时间流逝",
            "EN_US": "As time goes by"
        },
        "$Key": {
            "ZH_CN": "元数据",
            "EN_US": "Metadata"
        },
        "$Value": {
            "ZH_CN": "默认数值",
            "EN_US": "Default value"
        },
        "$Speed": {
            "ZH_CN": "流逝速度 (c/s)",
            "EN_US": "Passing speed (c/s)"
        },
        "$Threshold": {
            "ZH_CN": "阈值",
            "EN_US": "Threshold"
        },
        "$Kill": {
            "ZH_CN": "死亡",
            "EN_US": "Death"
        },
        "$Assimilate": {
            "ZH_CN": "同化",
            "EN_US": "Assimilate"
        }
    };
}

export { Wastage };