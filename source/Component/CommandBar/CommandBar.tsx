import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { DirectionalHint, IconButton } from "@fluentui/react";
import { LocalizationTooltipHost } from "../Localization/LocalizationTooltipHost";
import { AllI18nKeys } from "../Localization/Localization";
import { Component, ReactNode } from "react";
import "./CommandBar.scss";

interface ICommandBarProps {
    width: number;
}

class CommandBar extends Component<ICommandBarProps> {

    render(): ReactNode {
        return <Theme
            className="command-bar"
            backgroundLevel={BackgroundLevel.Level3}
            style={{ width: this.props.width }}
        >
            <div>
                {this.getRenderButton({ iconName: "Save", i18NKey: "Command.Bar.Save.Info" })}
                {this.getRenderButton({ iconName: "Play", i18NKey: "Command.Bar.Play.Info" })}
                {this.getRenderButton({ iconName: "HandsFree", i18NKey: "Command.Bar.Drag.Info" })}
                {this.getRenderButton({ iconName: "TouchPointer", i18NKey: "Command.Bar.Select.Info" })}
                {this.getRenderButton({ iconName: "WebAppBuilderFragmentCreate", i18NKey: "Command.Bar.Add.Group.Info" })}
                {this.getRenderButton({ iconName: "CubeShape", i18NKey: "Command.Bar.Add.Range.Info" })}
                {this.getRenderButton({ iconName: "StepSharedAdd", i18NKey: "Command.Bar.Add.Behavior.Info" })}
                {this.getRenderButton({ iconName: "Tag", i18NKey: "Command.Bar.Add.Tag.Info" })}
                {this.getRenderButton({ iconName: "Camera", i18NKey: "Command.Bar.Camera.Info" })}
            </div>
            <div>
                {this.getRenderButton({ iconName: "Settings", i18NKey: "Command.Bar.Setting.Info" })}
            </div>
        </Theme>
    }

    private getRenderButton(param: {
        i18NKey: AllI18nKeys;
        iconName?: string;
        click?: () => void;
    }): ReactNode {
        return <LocalizationTooltipHost 
            i18nKey={param.i18NKey}
            directionalHint={DirectionalHint.rightCenter}
        >
            <IconButton 
                style={{ height: this.props.width }}
                iconProps={{ iconName: param.iconName }}
                onClick={ param.click }
                className="command-button on-end"
            />
        </LocalizationTooltipHost>
    }
}

export { CommandBar };