import { BehaviorRecorder, IAnyBehaviorRecorder } from "@Model/Behavior";
import { Template } from "./Template";

const AllBehaviors: IAnyBehaviorRecorder[] = new Array(20).fill(0).map((_, i) => {
    let behavior = new BehaviorRecorder(Template);
    behavior.behaviorId = behavior.behaviorId + i;
    return behavior;
});

export { AllBehaviors };