import { BehaviorList as BehaviorListComponent } from "@Component/BehaviorList/BehaviorList";
import { Component } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { Behavior } from "@Model/Behavior";
import { Message } from "@Component/Message/Message";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { BehaviorPopup } from "@Component/BehaviorPopup/BehaviorPopup";
import "./BehaviorList.scss";

interface IBehaviorListProps {

}

@useSetting
@useStatusWithEvent("behaviorChange", "focusBehaviorChange", "behaviorAttrChange")
class BehaviorList extends Component<IBehaviorListProps & IMixinStatusProps & IMixinSettingProps> {
    
    private labelInnerClick: boolean = false;

    public render() {
        let behaviors: Behavior[] = [];
        if (this.props.status) {
            behaviors = this.props.status.model.behaviorPool.concat([]);
        }
        return <div
            className="behavior-list-panel-root"
            onClick={() => {
                if (this.props.status && !this.labelInnerClick) {
                    this.props.status.setBehaviorObject();
                }
                this.labelInnerClick = false;
            }}
        >
            {behaviors.length <=0 ? 
                <Message i18nKey="Panel.Info.Label.List.Error.Nodata"/> : null
            }
            <BehaviorListComponent
                behaviors={behaviors}
                focusBehaviors={
                    this.props.status?.focusBehavior ? 
                        [this.props.status?.focusBehavior] : undefined
                }
                click={(behavior) => {
                    if (this.props.status) {
                        this.props.status.setBehaviorObject(behavior as Behavior);
                    }
                    if (this.props.setting) {
                        this.props.setting.layout.focus("BehaviorDetails");
                    }
                    this.labelInnerClick = true;
                }}
                onAdd={() => {
                    this.props.status?.popup.showPopup(BehaviorPopup, {});
                }}
                delete={(behavior) => {
                    if (this.props.status && behavior instanceof Behavior) {
                        const status = this.props.status;
                        status.popup.showPopup(ConfirmPopup, {
                            infoI18n: "Popup.Delete.Behavior.Confirm",
                            titleI18N: "Popup.Action.Objects.Confirm.Title",
                            yesI18n: "Popup.Action.Objects.Confirm.Delete",
                            red: "yes",
                            yes: () => {
                                status.model.deleteBehavior(behavior);
                                status.setBehaviorObject();
                            }
                        })
                    }
                    this.labelInnerClick = true;
                }}
            />
        </div>;
    }
}

export { BehaviorList };