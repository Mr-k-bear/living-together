import { BehaviorRecorder, IAnyBehaviorRecorder } from "@Model/Behavior";
import { Template } from "@Behavior/Template";
import { PhysicsDynamics } from "@Behavior/PhysicsDynamics";
import { Brownian } from "@Behavior/Brownian";
import { BoundaryConstraint } from "@Behavior/BoundaryConstraint";
import { Tracking } from "@Behavior/Tracking";
import { ContactAttacking } from "@Behavior/ContactAttacking";
import { ContactAssimilate } from "@Behavior/ContactAssimilate";
import { DelayAssimilate } from "@Behavior/DelayAssimilate";

const AllBehaviors: IAnyBehaviorRecorder[] = [
    new BehaviorRecorder(Template),
    new BehaviorRecorder(PhysicsDynamics),
    new BehaviorRecorder(Brownian),
    new BehaviorRecorder(BoundaryConstraint),
    new BehaviorRecorder(Tracking),
    new BehaviorRecorder(ContactAttacking),
    new BehaviorRecorder(ContactAssimilate),
    new BehaviorRecorder(DelayAssimilate),
]

/**
 * 分类词条
 */
type ICategory = {key: string, category: Record<string, string>, item: IAnyBehaviorRecorder[]};

const AllBehaviorsWithCategory: ICategory[] = categoryBehaviors(AllBehaviors);

/**
 * 将词条进行分类
 */
function categoryBehaviors(behaviors: IAnyBehaviorRecorder[]): ICategory[] {
    let res: ICategory[] = [];
    for (let i = 0; i < behaviors.length; i++) {

        let category: ICategory | undefined = undefined;
        for (let j = 0; j < res.length; j++) {
            if (res[j].key === behaviors[i].category) {
                category = res[j];
            }
        }

        if (!category) {
            category = {
                key: behaviors[i].category,
                category: {},
                item: []
            }
            res.push(category);
        }

        if (behaviors[i].category[0] === "$") {
            let terms = behaviors[i].terms[behaviors[i].category];
            if (terms) {
                category.category = {...category.category, ...terms}
            }
        }
        
        category.item.push(behaviors[i]);
    }

    return res;
}

function getBehaviorById(id: string): IAnyBehaviorRecorder {
    for (let i = 0; i < AllBehaviors.length; i++) {
        if (AllBehaviors[i].behaviorId === id) {
            return AllBehaviors[i];
        }
    }
    return getBehaviorById("Template");
}

export { AllBehaviors, AllBehaviorsWithCategory, getBehaviorById, ICategory as ICategoryBehavior };