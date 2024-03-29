import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ITemplateBehaviorParameter = {
    testNumber: "number";
    testString: "string";
    testBoolean: "boolean";
    testColor: "color";
    testOption: "option";
    testR: "R";
    testG: "G";
    testLR: "LR";
    testLG: "LG";
    testVec: "vec";
    testCG: "CG",
    testCLG: "CLG",
}

type ITemplateBehaviorEvent = {}

class Template extends Behavior<ITemplateBehaviorParameter, ITemplateBehaviorEvent> {

    public override behaviorId: string = "Template";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Running";

    public override describe: string = "$Intro";

    public override category: string = "$Category";

    public override parameterOption = {
        testNumber: { name: "$Test", type: "number", defaultValue: 1, numberMax: 10, numberMin: 0, numberStep: 1 },
        testString: { name: "$Test", type: "string", defaultValue: "default", maxLength: 12 },
        testColor: { name: "$Test", type: "color", defaultValue: [.5, .1, 1], colorNormal: true },
        testOption: { name: "$Test", type: "option", defaultValue: "T", allOption: [
            { key: "P", name: "$Test"}, { key: "T", name: "$Title"}
        ]},
        testBoolean: { name: "$Test", type: "boolean", defaultValue: false, iconName: "Send" },
        testR: { name: "$Test", type: "R" },
        testG: { name: "$Test", type: "G" },
        testLR: { name: "$Test", type: "LR" },
        testLG: { name: "$Test", type: "LG" },
        testCG: { name: "$Test", type: "CG" },
        testCLG: { name: "$Test", type: "CLG" },
        testVec: { name: "$Test", type: "vec", defaultValue: [1, 2, 3], numberMax: 10, numberMin: 0, numberStep: 1 }
    };

    public effect = (individual: Individual, group: Group, model: Model, t: number): void => {
        
    }

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "行为",
            "EN_US": "Behavior"
        },
        "$Intro": {
            "ZH_CN": "这是一个模板行为",
            "EN_US": "This is a template behavior"
        },
        "$Test": {
            "ZH_CN": "测试参数",
            "EN_US": "Test Parameter"
        },
        "$Category": {
            "ZH_CN": "测序模板",
            "EN_US": "Test template"
        }
    };
}

export { Template };