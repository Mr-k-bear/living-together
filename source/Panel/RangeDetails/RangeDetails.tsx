import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps, Status } from "@Context/Status";
import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { ErrorMessage } from "@Component/ErrorMessage/ErrorMessage";
import { Range } from "@Model/Range";
import { ObjectID } from "@Model/Renderer";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import { LabelPicker } from "@Component/LabelPicker/LabelPicker";
import "./RangeDetails.scss";

@useStatusWithEvent("rangeAttrChange", "focusObjectChange")
class RangeDetails extends Component<IMixinStatusProps> {
    
    public readonly AttrI18nKey: AllI18nKeys[] = [
        "Common.Attr.Key.Display.Name",
        "Common.Attr.Key.Label",
        "Common.Attr.Key.Display",
        "Common.Attr.Key.Update",
        "Common.Attr.Key.Color",
        "Common.Attr.Key.Position.X",
        "Common.Attr.Key.Position.Y",
        "Common.Attr.Key.Position.Z",
        "Common.Attr.Key.Radius.X",
        "Common.Attr.Key.Radius.Y",
        "Common.Attr.Key.Radius.Z"
    ]

    private renderAttrInput(
        id: ObjectID, key: number, val: string | number | undefined,
        change: (val: string, status: Status) => any,
        step?: number, max?: number, min?: number
    ) {
        // console.log(id, key, val, step, max, min)
        const handelFunc = (e: string) => {
            if (this.props.status) {
                change(e, this.props.status);
            }
        }
        if (step) {
            return <AttrInput
                id={id} isNumber={true} step={step} keyI18n={this.AttrI18nKey[key]}
                value={val} max={max} min={min}
                valueChange={handelFunc}
            />
        } else {
            return <AttrInput
                id={id} keyI18n={this.AttrI18nKey[key]} value={val}
                valueChange={handelFunc}
            />
        }
    }

    private renderFrom(range: Range) {
        
        let keyIndex = 0;

        return <>
            {this.renderAttrInput(range.id, keyIndex ++, range.displayName, (val, status) => {
                status.changeRangeAttrib(range.id, "displayName", val);
            })}

            <LabelPicker keyI18n={this.AttrI18nKey[keyIndex ++]}
                labels={this.props.status?.model.labelPool ?? []}
                // labels={[]}
            />
            
            <TogglesInput keyI18n={this.AttrI18nKey[keyIndex ++]} value={range.display} valueChange={(val) => {
                if (this.props.status) {
                    this.props.status.changeRangeAttrib(range.id, "display", val);
                }
            }}/>

            <TogglesInput keyI18n={this.AttrI18nKey[keyIndex ++]} value={range.update} valueChange={(val) => {
                if (this.props.status) {
                    this.props.status.changeRangeAttrib(range.id, "update", val);
                }
            }}/>

            <ColorInput keyI18n={this.AttrI18nKey[keyIndex ++]} value={range.color} normal valueChange={(color) => {
                if (this.props.status) {
                    this.props.status.changeRangeAttrib(range.id, "color", color);
                }
            }}/>

            {this.renderAttrInput(range.id, keyIndex ++, range.position[0], (val, status) => {
                range.position[0] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
            {this.renderAttrInput(range.id, keyIndex ++, range.position[1], (val, status) => {
                range.position[1] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
            {this.renderAttrInput(range.id, keyIndex ++, range.position[2], (val, status) => {
                range.position[2] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
			
            {this.renderAttrInput(range.id, keyIndex ++, range.radius[0], (val, status) => {
                range.radius[0] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
            {this.renderAttrInput(range.id, keyIndex ++, range.radius[1], (val, status) => {
                range.radius[1] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
            {this.renderAttrInput(range.id, keyIndex ++, range.radius[2], (val, status) => {
                range.radius[2] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
		</>
    }

	public render(): ReactNode {
        if (this.props.status) {
            if (this.props.status.focusObject.size <= 0) {
                return <ErrorMessage i18nKey="Panel.Info.Range.Details.Attr.Error.Unspecified"/>;
            }
            if (this.props.status.focusObject.size > 1) {
                return <ErrorMessage i18nKey="Common.Attr.Key.Error.Multiple"/>;
            }
            let id: ObjectID = "";
            this.props.status.focusObject.forEach((cid => id = cid));
            
            let range = this.props.status!.model.getObjectById(id);

            if (range instanceof Range) {
                return this.renderFrom(range);
            } else {
                return <ErrorMessage i18nKey="Panel.Info.Range.Details.Attr.Error.Not.Range"/>;
            }
        }
		return <ErrorMessage i18nKey="Panel.Info.Range.Details.Attr.Error.Unspecified"/>;
	}
}

export { RangeDetails };