import { BackgroundLevel, FontLevel, Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Component } from "react";
import "./LabelList.scss";

interface ILabelListCommandProps {}

class LabelListCommand extends Component<ILabelListCommandProps> {
    
    public render() {
        return <Theme
            className="label-list-command-bar"
            backgroundLevel={BackgroundLevel.Level4}
            fontLevel={FontLevel.normal}
        >
            <div className="command-item">
                <Icon iconName="Tag"></Icon>
            </div>
        </Theme>
    }
}

export { LabelListCommand };