import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { Range } from "@Model/Range";
import { ObjectID } from "@Model/Renderer";
import "./RangeDetails.scss";

@useStatusWithEvent("rangeAttrChange", "focusObjectChange")
class RangeDetails extends Component<IMixinStatusProps> {

    private renderErrorFrom(error: AllI18nKeys) {
        return <>
			<AttrInput keyI18n="Common.Attr.Key.Display.Name" disable disableI18n={error}/>
			<AttrInput keyI18n="Common.Attr.Key.Position.X" disable disableI18n={error}/>
            <AttrInput keyI18n="Common.Attr.Key.Position.Y" disable disableI18n={error}/>
            <AttrInput keyI18n="Common.Attr.Key.Position.Z" disable disableI18n={error}/>
		</>
    }

    private renderFrom(range: Range) {
        return <>
			<AttrInput
                keyI18n="Common.Attr.Key.Display.Name"
                value={range.displayName}
                valueChange={(e) => {
                    this.props.status ? this.props.status.changeRangeAttrib(range.id, "displayName", e) : null;
                }}
            />
			<AttrInput
                isNumber={true}
                step={.1}
                keyI18n="Common.Attr.Key.Position.X"
                value={range.position[0]}
                valueChange={(e) => {
                    if (this.props.status) {
                        range.position[0] = (e as any) / 1;
                        this.props.status.changeRangeAttrib(range.id, "position", range.position);
                    }
                }}
            />
            <AttrInput
                isNumber={true}
                step={.1}
                keyI18n="Common.Attr.Key.Position.Y"
                value={range.position[1]}
                valueChange={(e) => {
                    if (this.props.status) {
                        range.position[1] = (e as any) / 1;
                        this.props.status.changeRangeAttrib(range.id, "position", range.position);
                    }
                }}
            />
            <AttrInput
                isNumber={true}
                step={.1}
                keyI18n="Common.Attr.Key.Position.Z"
                value={range.position[2]}
                valueChange={(e) => {
                    if (this.props.status) {
                        range.position[2] = (e as any) / 1;
                        this.props.status.changeRangeAttrib(range.id, "position", range.position);
                    }
                }}
            />
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