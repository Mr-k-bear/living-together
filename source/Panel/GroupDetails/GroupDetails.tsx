import { Component, ReactNode } from "react";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { ComboInput, IDisplayItem } from "@Input/ComboInput/ComboInput";
import { Message } from "@Input/Message/Message";
import { ObjectID } from "@Model/Renderer";
import { ColorInput } from "@Input/ColorInput/ColorInput";
import { TogglesInput } from "@Input/TogglesInput/TogglesInput";
import { LabelPicker } from "@Input/LabelPicker/LabelPicker";
import { Group, GenMod } from "@Model/Group";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { ObjectPicker } from "@Input/ObjectPicker/ObjectPicker";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { BehaviorPicker } from "@Input/BehaviorPicker/BehaviorPicker";
import "./GroupDetails.scss";

interface IGroupDetailsProps {}

const mapGenModToI18nKey = new Map<GenMod, AllI18nKeys>();
mapGenModToI18nKey.set(GenMod.Point, "Common.Attr.Key.Generation.Mod.Point");
mapGenModToI18nKey.set(GenMod.Range, "Common.Attr.Key.Generation.Mod.Range");

const allOption: IDisplayItem[] = [
    {nameKey: "Common.Attr.Key.Generation.Mod.Point", key: GenMod.Point},
    {nameKey: "Common.Attr.Key.Generation.Mod.Range", key: GenMod.Range}
];

@useSetting
@useStatusWithEvent(
    "groupAttrChange", "groupLabelChange", "focusObjectChange",
    "focusBehaviorChange", "behaviorChange", "groupBehaviorChange",
    "behaviorAttrChange"
)
class GroupDetails extends Component<IGroupDetailsProps & IMixinStatusProps & IMixinSettingProps> {

	private renderFrom(group: Group) {
		return <>

			<Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            <AttrInput
                id={group.id} keyI18n="Common.Attr.Key.Display.Name" value={group.displayName}
                valueChange={(val) => {
                    this.props.status?.changeGroupAttrib(group.id, "displayName", val);
                }}
            />

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={group.color} normal
                valueChange={(color) => {
                    this.props.status?.changeGroupAttrib(group.id, "color", color);
                }}
            />

            <AttrInput
                id={group.id} isNumber={true} step={10} keyI18n="Common.Attr.Key.Size"
                value={group.size} min={0}
                valueChange={(val) => {
                    this.props.status?.changeGroupAttrib(group.id, "size", (val as any) / 1);
                }}
            />

            <LabelPicker
                keyI18n="Common.Attr.Key.Label"
                labels={group.allLabels()}
                labelAdd={(label) => {
                    if (this.props.status) {
                        this.props.status.addGroupLabel(group.id, label);
                    }
                }}
                labelDelete={(label) => {
                    if (this.props.status) {
                        this.props.status.deleteGroupLabel(group.id, label);
                    }
                }}
            />
            
            <TogglesInput
                keyI18n="Common.Attr.Key.Display"
                value={group.display} valueChange={(val) => {
                    if (this.props.status) {
                        this.props.status.changeGroupAttrib(group.id, "display", val);
                    }
                }}
            />

            <TogglesInput
                keyI18n="Common.Attr.Key.Update"
                value={group.update} valueChange={(val) => {
                    if (this.props.status) {
                        this.props.status.changeGroupAttrib(group.id, "update", val);
                    }
                }}
            />

			<TogglesInput
				keyI18n="Common.Attr.Key.Delete" red
				onIconName="delete" offIconName="delete"
				valueChange={() => {
					if (this.props.status) {
                        const status = this.props.status;
						status.popup.showPopup(ConfirmPopup, {
							infoI18n: "Popup.Delete.Objects.Confirm",
							titleI18N: "Popup.Action.Objects.Confirm.Title",
							yesI18n: "Popup.Action.Objects.Confirm.Delete",
							red: "yes",
							yes: () => {
								status.model.deleteObject([group]);
						        status.setFocusObject(new Set());
							}
						})
					}
				}}
			/>
            
            <Message i18nKey="Common.Attr.Title.Behaviors" isTitle/>

            <BehaviorPicker
                behavior={group.behaviors}
                focusBehavior={this.props.status?.focusBehavior}
                click={(behavior) => {
                    if (behavior.isDeleted()) return;
                    this.props.status?.setBehaviorObject(behavior);
                }}
                action={(behavior) => {
                    if (behavior.isDeleted()) return;
                    this.props.status?.setBehaviorObject(behavior);
                    setTimeout(() => {
                        this.props.setting?.layout.focus("BehaviorDetails");
                    });
                }}
                delete={(behavior) => {
                    this.props.status?.deleteGroupBehavior(group.id, behavior);
                }}
                add={(behavior) => {
                    this.props.status?.addGroupBehavior(group.id, behavior);
                }}
            />

            <Message i18nKey="Common.Attr.Title.Individual.Generation" isTitle/>

            <ComboInput
                keyI18n="Common.Attr.Key.Generation.Mod"
                value={{
                    nameKey: mapGenModToI18nKey.get(group.genMethod) ?? "Common.No.Data",
                    key: group.genMethod
                }}
                allOption={allOption}
                valueChange={(value) => {
                    if (this.props.status) {
                        this.props.status.changeGroupAttrib(group.id, "genMethod", value.key as any);
                    }
                }}
            />

            <AttrInput
                id={group.id} isNumber={true} step={1} keyI18n="Common.Attr.Key.Generation.Count"
                value={group.genCount} min={1} max={1000}
                valueChange={(val) => {
                    this.props.status?.changeGroupAttrib(group.id, "genCount", (val as any) / 1);
                }}
            />

            {group.genMethod === GenMod.Point ? this.renderPointGenOption(group) : null}

            {group.genMethod === GenMod.Range ? this.renderRangeGenOption(group) : null}

            <TogglesInput
				keyI18n="Common.Attr.Key.Generation"
				onIconName="BuildDefinition" offIconName="BuildDefinition"
				valueChange={() => {
					if(!group.genIndividuals()) {
                        this.props.status?.changeGroupAttrib(group.id, "genErrorMessageShowCount", 1);
                    }
				}}
			/>

            <Message i18nKey="Common.Attr.Title.Individual.kill" isTitle/>

            <AttrInput
                id={group.id} isNumber={true} step={1} keyI18n="Common.Attr.Key.Kill.Count"
                value={group.killCount} min={1} max={1000}
                valueChange={(val) => {
                    this.props.status?.changeGroupAttrib(group.id, "killCount", (val as any) / 1);
                }}
            />

            <TogglesInput
				keyI18n="Common.Attr.Key.Kill.Random"
				onIconName="RemoveFilter" offIconName="RemoveFilter"
				valueChange={() => {
					group.killIndividuals()
				}}
			/>

		</>
	}

    private renderPointGenOption(group: Group) {
        return <>
            <AttrInput
                id={group.id} isNumber={true} step={0.1} keyI18n="Common.Attr.Key.Generation.Point.X"
                value={group.genPoint[0] ?? 0}
                valueChange={(val) => {
                    group.genPoint[0] = (val as any) / 1;
                    this.props.status?.changeGroupAttrib(group.id, "genPoint", group.genPoint);
                }}
            />

            <AttrInput
                id={group.id} isNumber={true} step={0.1} keyI18n="Common.Attr.Key.Generation.Point.Y"
                value={group.genPoint[1] ?? 0}
                valueChange={(val) => {
                    group.genPoint[1] = (val as any) / 1;
                    this.props.status?.changeGroupAttrib(group.id, "genPoint", group.genPoint);
                }}
            />

            <AttrInput
                id={group.id} isNumber={true} step={0.1} keyI18n="Common.Attr.Key.Generation.Point.Z"
                value={group.genPoint[2] ?? 0}
                valueChange={(val) => {
                    group.genPoint[2] = (val as any) / 1;
                    this.props.status?.changeGroupAttrib(group.id, "genPoint", group.genPoint);
                }}
            />
        </>
    }

    private renderRangeGenOption(group: Group) {

        let isRenderErrorInfo: boolean = false;
        if (group.genErrorMessageShowCount > 0) {
            group.genErrorMessageShowCount --;
            if (group.genErrorMessage) {
                isRenderErrorInfo = true;
            }
        } else {
            group.genErrorMessage = undefined;
        }

        return <>
            <ObjectPicker
                keyI18n="Common.Attr.Key.Generation.Use.Range"
                type={"LR"}
                value={group.genRange}
                errorI18n={isRenderErrorInfo ? group.genErrorMessage as any : undefined}
                valueChange={(value) => {
                    this.props.status?.changeGroupAttrib(group.id, "genRange", value);
                }}
                cleanValue={() => {
                    this.props.status?.changeGroupAttrib(group.id, "genRange", undefined);
                }}
            />
        </>
    }

	public render(): ReactNode {
		if (this.props.status) {
            if (this.props.status.focusObject.size <= 0) {
                return <Message i18nKey="Panel.Info.Group.Details.Attr.Error.Unspecified"/>;
            }
            if (this.props.status.focusObject.size > 1) {
                return <Message i18nKey="Common.Attr.Key.Error.Multiple"/>;
            }
            let id: ObjectID = "";
            this.props.status.focusObject.forEach((cid => id = cid));
            
            let group = this.props.status!.model.getObjectById(id);

            if (group instanceof Group) {
                return this.renderFrom(group);
            } else {
                return <Message i18nKey="Panel.Info.Group.Details.Attr.Error.Not.Group"/>;
            }
        }
		return <Message i18nKey="Panel.Info.Group.Details.Attr.Error.Unspecified"/>;
	}
}

export { GroupDetails }