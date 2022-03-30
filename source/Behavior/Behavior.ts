import { BehaviorRecorder, IAnyBehaviorRecorder } from "@Model/Behavior";
import { Template } from "./Template";
import { Dynamics } from "./Dynamics";
import { Brownian } from "./Brownian";

const AllBehaviors: IAnyBehaviorRecorder[] = [
    new BehaviorRecorder(Dynamics),
    new BehaviorRecorder(Brownian)
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

console.log(AllBehaviorsWithCategory)

export { AllBehaviors, AllBehaviorsWithCategory, ICategory as ICategoryBehavior };