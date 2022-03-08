import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps, Status } from "@Context/Status";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { Range } from "@Model/Range";
import { ObjectID } from "@Model/Renderer";
import "./RangeDetails.scss";

@useStatusWithEvent("rangeAttrChange", "focusObjectChange")
class RangeDetails extends Component<IMixinStatusProps> {
    
    public readonly AttrI18nKey: AllI18nKeys[] = [
        "Common.Attr.Key.Display.Name",
        "Common.Attr.Key.Position.X",
        "Common.Attr.Key.Position.Y",
        "Common.Attr.Key.Position.Z",
        "Common.Attr.Key.Radius.X",
        "Common.Attr.Key.Radius.Y",
        "Common.Attr.Key.Radius.Z"
    ]

    private renderErrorFrom(error: AllI18nKeys) {
        return <>
            {this.AttrI18nKey.map((key, index) => {
                return <AttrInput key={index} keyI18n={key} disable disableI18n={error}/>
            })}
        </>
    }

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
        // console.log(range);
        return <>
            {this.renderAttrInput(range.id, 0, range.displayName, (val, status) => {
                status.changeRangeAttrib(range.id, "displayName", val);
            })}

            {this.renderAttrInput(range.id, 1, range.position[0], (val, status) => {
                range.position[0] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
            {this.renderAttrInput(range.id, 2, range.position[1], (val, status) => {
                range.position[1] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
            {this.renderAttrInput(range.id, 3, range.position[2], (val, status) => {
                range.position[2] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "position", range.position);
            }, .1)}
			
            {this.renderAttrInput(range.id, 4, range.radius[0], (val, status) => {
                range.radius[0] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
            {this.renderAttrInput(range.id, 5, range.radius[1], (val, status) => {
                range.radius[1] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
            {this.renderAttrInput(range.id, 6, range.radius[2], (val, status) => {
                range.radius[2] = (val as any) / 1;
                status.changeRangeAttrib(range.id, "radius", range.radius);
            }, .1, undefined, 0)}
		</>
    }

	public render(): ReactNode {
        if (this.props.status) {
            if (this.props.status.focusObject.size <= 0) {
                return this.renderErrorFrom("Panel.Info.Range.Details.Attr.Error.Unspecified");
            }
            if (this.props.status.focusObject.size > 1) {
                return this.renderErrorFrom("Common.Attr.Key.Error.Multiple");
            }
            let id: ObjectID = 0;
            this.props.status.focusObject.forEach((cid => id = cid));
            
            let range = this.props.status!.model.getObjectById(id);

            if (range instanceof Range) {
                return this.renderFrom(range);
            } else {
                return this.renderErrorFrom("Panel.Info.Range.Details.Attr.Error.Not.Range");
            }
        }
		return this.renderErrorFrom("Panel.Info.Range.Details.Attr.Error.Unspecified");
	}
}

export { RangeDetails };