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

    private renderFrom(range: Range) {

        return <>

            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            <AttrInput
                id={range.id} keyI18n="Common.Attr.Key.Display.Name" value={range.displayName}
                valueChange={(val) => {
                    this.props.status?.changeRangeAttrib(range.id, "displayName", val);
                }}
            />

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={range.color} normal
                valueChange={(color) => {
                    this.props.status?.changeRangeAttrib(range.id, "color", color);
                }}
            />

            <LabelPicker
                keyI18n="Common.Attr.Key.Label"
                labels={range.allLabels()}
                labelAdd={(label) => {
                    this.props.status?.addRangeLabel(range.id, label);
                }}
                labelDelete={(label) => {
                    this.props.status?.deleteRangeLabel(range.id, label);
                }}
            />
            
            <TogglesInput
                keyI18n="Common.Attr.Key.Display"
                value={range.display} valueChange={(val) => {
                    this.props.status?.changeRangeAttrib(range.id, "display", val);
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

            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Position.X"}
                value={range.position[0]}
                valueChange={(val) => {
                    range.position[0] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "position", range.position);
                }}
            />

            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Position.Y"}
                value={range.position[1]}
                valueChange={(val) => {
                    range.position[1] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "position", range.position);
                }}
            />

            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Position.Z"}
                value={range.position[2]}
                valueChange={(val) => {
                    range.position[2] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "position", range.position);
                }}
            />
			
            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Radius.X"}
                value={range.radius[0]} min={0}
                valueChange={(val) => {
                    range.radius[0] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "radius", range.radius);
                }}
            />

            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Radius.Y"}
                value={range.radius[1]} min={0}
                valueChange={(val) => {
                    range.radius[1] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "radius", range.radius);
                }}
            />

            <AttrInput
                id={range.id} isNumber={true} step={.1} keyI18n={"Common.Attr.Key.Radius.Z"}
                value={range.radius[2]} min={0}
                valueChange={(val) => {
                    range.radius[2] = (val as any) / 1;
                    this.props.status?.changeRangeAttrib(range.id, "radius", range.radius);
                }}
            />
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