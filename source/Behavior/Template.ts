import { Behavior } from "@Model/Behavior";

type ITemplateBehaviorParameter = {
    
}

type ITemplateBehaviorEvent = {}

class Template extends Behavior<ITemplateBehaviorParameter, ITemplateBehaviorEvent> {

    public override behaviorId: string = "Template";

    public override behaviorName: string = "Behavior.Template.Title";

    public override iconName: string = "Running";

    public override describe: string = "Behavior.Template.Intro";
}

export { Template };