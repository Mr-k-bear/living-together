import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps, Status } from "@Context/Status";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { Message } from "@Component/Message/Message";
import { Range } from "@Model/Range";
import { ObjectID } from "@Model/Renderer";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import { LabelPicker } from "@Component/LabelPicker/LabelPicker";
import "./RangeDetails.scss";

@useStatusWithEvent("rangeAttrChange", "focusObjectChange", "rangeLabelChange")
class RangeDetails extends Component<IMixinStatusProps> {

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

    private renderFrom(range: Range) {

        return <>

            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Display.Name", range.displayName,
                (val, status) => {
                    status.changeRangeAttrib(range.id, "displayName", val);
                }
            )}

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={range.color} normal
                valueChange={(color) => {
                    if (this.props.status) {
                        this.props.status.changeRangeAttrib(range.id, "color", color);
                    }
                }}
            />

            <LabelPicker
                keyI18n="Common.Attr.Key.Label"
                labels={range.allLabels()}
                labelAdd={(label) => {
                    if (this.props.status) {
                        this.props.status.addRangeLabel(range.id, label);
                    }
                }}
                labelDelete={(label) => {
                    if (this.props.status) {
                        this.props.status.deleteRangeLabel(range.id, label);
                    }
                }}
            />
            
            <TogglesInput
                keyI18n="Common.Attr.Key.Display"
                value={range.display} valueChange={(val) => {
                    if (this.props.status) {
                        this.props.status.changeRangeAttrib(range.id, "display", val);
                    }
                }}
            />

            <TogglesInput
                keyI18n="Common.Attr.Key.Update"
                value={range.update} valueChange={(val) => {
                    if (this.props.status) {
                        this.props.status.changeRangeAttrib(range.id, "update", val);
                    }
                }}
            />

            <TogglesInput
				keyI18n="Common.Attr.Key.Delete"
				onIconName="delete" offIconName="delete"
				valueChange={() => {
					if (this.props.status) {
						this.props.status.model.deleteObject([range]);
						this.props.status.setFocusObject(new Set());
					}
				}}
			/>

            <Message i18nKey="Common.Attr.Title.Spatial" isTitle/>

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Position.X", 
                range.position[0], (val, status) => {
                    range.position[0] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "position", range.position);
                }, .1
            )}

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Position.Y",
                range.position[1],(val, status) => {
                    range.position[1] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "position", range.position);
                }, .1
            )}

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Position.Z",
                range.position[2], (val, status) => {
                    range.position[2] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "position", range.position);
                }, .1
            )}
			
            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Radius.X",
                range.radius[0], (val, status) => {
                    range.radius[0] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "radius", range.radius);
                }, .1, undefined, 0
            )}

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Radius.Y",
                range.radius[1], (val, status) => {
                    range.radius[1] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "radius", range.radius);
                }, .1, undefined, 0
            )}

            {this.renderAttrInput(
                range.id, "Common.Attr.Key.Radius.Z",
                range.radius[2], (val, status) => {
                    range.radius[2] = (val as any) / 1;
                    status.changeRangeAttrib(range.id, "radius", range.radius);
                }, .1, undefined, 0
            )}
		</>
    }

	public render(): ReactNode {
        if (this.props.status) {
            if (this.props.status.focusObject.size <= 0) {
                return <Message i18nKey="Panel.Info.Range.Details.Attr.Error.Unspecified"/>;
            }
            if (this.props.status.focusObject.size > 1) {
                return <Message i18nKey="Common.Attr.Key.Error.Multiple"/>;
            }
            let id: ObjectID = "";
            this.props.status.focusObject.forEach((cid => id = cid));
            
            let range = this.props.status!.model.getObjectById(id);

            if (range instanceof Range) {
                return this.renderFrom(range);
            } else {
                return <Message i18nKey="Panel.Info.Range.Details.Attr.Error.Not.Range"/>;
            }
        }
		return <Message i18nKey="Panel.Info.Range.Details.Attr.Error.Unspecified"/>;
	}
}

export { RangeDetails };