import { BehaviorRecorder, IAnyBehaviorRecorder } from "@Model/Behavior";
import { Template } from "./Template";

const AllBehaviors: IAnyBehaviorRecorder[] = [
    new BehaviorRecorder(Template)
]

export { AllBehaviors };