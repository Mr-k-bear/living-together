import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps, Status } from "@Context/Status";
import { Message } from "@Component/Message/Message";
import { ObjectID } from "@Model/Renderer";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import { LabelPicker } from "@Component/LabelPicker/LabelPicker";
import { Group, GenMod } from "@Model/Group";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { ComboInput, IDisplayItem } from "@Component/ComboInput/ComboInput";
import "./GroupDetails.scss";

interface IGroupDetailsProps {}

const mapGenModToI18nKey = new Map<GenMod, AllI18nKeys>();
mapGenModToI18nKey.set(GenMod.Point, "Common.Attr.Key.Generation.Mod.Point");
mapGenModToI18nKey.set(GenMod.Range, "Common.Attr.Key.Generation.Mod.Range");

const allOption: IDisplayItem[] = [
    {nameKey: "Common.Attr.Key.Generation.Mod.Point", key: GenMod.Point},
    {nameKey: "Common.Attr.Key.Generation.Mod.Range", key: GenMod.Range}
];

@useStatusWithEvent("groupAttrChange", "groupLabelChange", "focusObjectChange")
class GroupDetails extends Component<IGroupDetailsProps & IMixinStatusProps> {

	private renderAttrInput(
        id: ObjectID, key: AllI18nKeys, val: string | number | undefined,
        change: (val: string, status: Status) => any,
        step?: number, max?: number, min?: number
    ) {
        const handelFunc = (e: string) => {
            if (this.props.status) {
                change(e, this.props.status);
            }
        }
        if (step) {
            return <AttrInput
                id={id} isNumber={true} step={step} keyI18n={key}
                value={val} max={max} min={min}
                valueChange={handelFunc}
            />
        } else {
            return <AttrInput
                id={id} keyI18n={key} value={val}
                valueChange={handelFunc}
            />
        }
    }

	private renderFrom(group: Group) {
		return <>

			<Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

			{this.renderAttrInput(
                group.id, "Common.Attr.Key.Display.Name", group.displayName,
                (val, status) => {
                    status.changeGroupAttrib(group.id, "displayName", val);
                }
            )}

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={group.color} normal
                valueChange={(color) => {
                    if (this.props.status) {
                        this.props.status.changeGroupAttrib(group.id, "color", color);
                    }
                }}
            />

            {this.renderAttrInput(
                group.id, "Common.Attr.Key.Size", group.size,
                (val, status) => {
                    status.changeGroupAttrib(group.id, "size", (val as any) / 1);
                }, 10, undefined, 0
            )}

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
				keyI18n="Common.Attr.Key.Delete"
				onIconName="delete" offIconName="delete"
				valueChange={() => {
					if (this.props.status) {
						this.props.status.model.deleteObject([group]);
						this.props.status.setFocusObject(new Set());
					}
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