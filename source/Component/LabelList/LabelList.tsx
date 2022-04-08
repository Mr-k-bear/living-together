import { Component, RefObject } from "react";
import { Icon } from "@fluentui/react";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";
import { Label } from "@Model/Label";
import "./LabelList.scss";

interface ILabelListProps {
    minHeight?: number;
    maxWidth?: number;
    width?: number;
    labels: Label[];
    addRef?: RefObject<HTMLDivElement>;
    focusLabel?: Label;
    clickLabel?: (label: Label) => any;
    deleteLabel?: (label: Label) => any;
    addLabel?: () => any;
}

@useSetting
class LabelList extends Component<ILabelListProps & IMixinSettingProps> {

    private isDeleteClick: boolean = false;

    private renderLabel(label: Label) {

        const theme = this.props.setting?.themes ?? Themes.dark;
        const classList: string[] = ["label"];
        classList.push( theme === Themes.dark ? "dark" : "light" );
        const isFocus = this.props.focusLabel && this.props.focusLabel.equal(label);
        if (isFocus) {
            classList.push("focus");
        }
        if (this.props.maxWidth) {
            classList.push("one-line");
        }
        const colorCss = `rgb(${label.color.join(",")})`;
        const isDelete = label.isDeleted();

        return <div
            style={{
                minHeight: this.props.minHeight,
                maxWidth: this.props.maxWidth
            }}
            className={classList.join(" ")}
            key={label.id}
            onClick={() => {
                if (this.props.clickLabel && !this.isDeleteClick) {
                    this.props.clickLabel(label);
                }
                this.isDeleteClick = false;
            }}
        >
            <div className="label-color" style={{
                backgroundColor: colorCss,
                borderRadius: isFocus ? 0 : 3
            }}/>
            <div
                className="label-name"
                style={{
                    textDecoration: isDelete ? "line-through" : undefined,
                    opacity: isDelete ? ".6" : undefined
                }}
            >
                <div>{label.name}</div>
            </div>
            {
                this.props.deleteLabel ?
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

    private renderAllLabels() {
        return this.props.labels.map((label) => {
            return this.renderLabel(label);
        });
    }

    private renderAddButton() {
        const theme = this.props.setting?.themes ?? Themes.dark;
        const classList: string[] = ["label", "add-button"];
        classList.push( theme === Themes.dark ? "dark" : "light" );

        return <div
            className={classList.join(" ")}
            ref={this.props.addRef}
            style={{
                minHeight: this.props.minHeight,
                minWidth: this.props.minHeight
            }}
            onClick={() => {
                this.props.addLabel ? this.props.addLabel() : null
            }}
        >
            <Icon iconName="add"></Icon>
        </div>;
    }
    
    public render() {
        return <div className="label-list-root">
            {this.renderAllLabels()}
            {this.props.addLabel ? this.renderAddButton() : null}
        </div>;
    }
}

export { LabelList };