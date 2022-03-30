import { Behavior } from "@Model/Behavior";
import { Group } from "@Model/Group";
import { Individual } from "@Model/Individual";
import { Model } from "@Model/Model";

type ITemplateBehaviorParameter = {
    
}

type ITemplateBehaviorEvent = {}

class Template extends Behavior<ITemplateBehaviorParameter, ITemplateBehaviorEvent> {

    public override behaviorId: string = "Template";

    public override behaviorName: string = "$Title";

    public override iconName: string = "Running";

    public override describe: string = "$Intro";

    public override category: string = "$Category";

    public override terms: Record<string, Record<string, string>> = {
        "$Title": {
            "ZH_CN": "行为",
            "EN_US": "Behavior"
        },
        "$Intro": {
            "ZH_CN": "这是一个模板行为",
            "EN_US": "This is a template behavior"
        }
    };

    public effect(individual: Individual, group: Group, model: Model, t: number): void {
        
    }
}

export { Template };