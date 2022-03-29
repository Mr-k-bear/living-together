import { BehaviorRecorder, IAnyBehaviorRecorder } from "@Model/Behavior";
import { Template } from "./Template";

const AllBehaviors: IAnyBehaviorRecorder[] = new Array(4).fill(0).map((_, i) => {
    let behavior = new BehaviorRecorder(Template);
    behavior.behaviorId = behavior.behaviorId + i;
    behavior.behaviorName = behavior.behaviorName + Math.random().toString(36).slice(-6);
    behavior.category = "Category" + Math.floor(Math.random() * 3).toString();
    return behavior;
});

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

export { AllBehaviors, AllBehaviorsWithCategory, ICategory as ICategoryBehavior };