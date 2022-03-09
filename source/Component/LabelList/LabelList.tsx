import { Component } from "react";
import { Label } from "@Model/Label";
import { Icon } from "@fluentui/react";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";
import "./LabelList.scss";

interface ILabelListProps {
    labels: Label[];
    canDelete?: boolean;
}

interface ILabelListState {
    focusLabel?: Label;
}

@useSetting
class LabelList extends Component<ILabelListProps & IMixinSettingProps, ILabelListState> {
    
    public state: Readonly<ILabelListState> = {
        focusLabel: undefined
    };

    private renderLabel(label: Label) {

        const theme = this.props.setting?.themes ?? Themes.dark;
        const themeClassName = theme === Themes.dark ? "dark" : "light";
        const colorCss = `rgb(${label.color.join(",")})`;

        return <div className={`label ${themeClassName}`} key={label.id}>
            <div className="label-color" style={{
                backgroundColor: colorCss
            }}/>
            <div className="label-name">
                {label.name}
            </div>
            {
                this.props.canDelete ? 
                <div className="delete-button">
                    <Icon iconName="delete"></Icon>
                </div> : null
            }
        </div>
    }
    
    public render() {
        return <>
            {
                this.props.labels.map((label) => {
                    return this.renderLabel(label);
                })
            }
        </>
    }
}

export { LabelList };