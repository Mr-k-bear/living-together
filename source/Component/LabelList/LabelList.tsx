import { Component } from "react";
import { Label } from "@Model/Label";
import { Icon } from "@fluentui/react";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";
import { ErrorMessage } from "@Component/ErrorMessage/ErrorMessage";
import "./LabelList.scss";

interface ILabelListProps {
    labels: Label[];
    canDelete?: boolean;
    focusLabel?: Label;
    clickLabel?: (label: Label) => any;
    deleteLabel?: (label: Label) => any;
}

@useSetting
class LabelList extends Component<ILabelListProps & IMixinSettingProps> {

    private isDeleteClick: boolean = false;

    private renderLabel(label: Label) {

        const theme = this.props.setting?.themes ?? Themes.dark;
        const classList:string[] = ["label"];
        classList.push( theme === Themes.dark ? "dark" : "light" );
        const isFocus = this.props.focusLabel && this.props.focusLabel.equal(label);
        if (isFocus) {
            classList.push("focus");
        }
        const colorCss = `rgb(${label.color.join(",")})`;

        return <div
            className={classList.join(" ")}
            key={label.id}
            onClick={() => {
                if (this.props.clickLabel && !this.isDeleteClick) {
                    this.props.clickLabel(label);
                }
                this.isDeleteClick = false;
            }}
            style={{
                borderColor: isFocus ? colorCss : undefined
            }}
        >
            <div className="label-color" style={{
                backgroundColor: colorCss,
                borderRadius: isFocus ? 0 : 3
            }}/>
            <div className="label-name">
                {label.name}
            </div>
            {
                this.props.canDelete ? 
                <div
                    className="delete-button"
                    onClick={() => {
                        this.isDeleteClick = true;
                        if (this.props.deleteLabel) {
                            this.props.deleteLabel(label);
                        }
                    }}
                >
                    <Icon iconName="delete"></Icon>
                </div> : null
            }
        </div>
    }

    private renderAllLabels(labels: Label[]) {
        return this.props.labels.map((label) => {
            return this.renderLabel(label);
        });
    }
    
    public render() {
        if (this.props.labels.length > 0) {
            return this.renderAllLabels(this.props.labels);
        } else {
            return <ErrorMessage i18nKey="Panel.Info.Label.List.Error.Nodata"/>
        }
    }
}

export { LabelList };