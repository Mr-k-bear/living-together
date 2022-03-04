import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { DirectionalHint, IconButton } from "@fluentui/react";
import { LocalizationTooltipHost } from "../Localization/LocalizationTooltipHost";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { AllI18nKeys } from "../Localization/Localization";
import { Component, ReactNode } from "react";
import { MouseMod } from "@GLRender/ClassicRenderer";
import "./CommandBar.scss";

interface ICommandBarProps {
    width: number;
}

@useStatus
@useSetting
class CommandBar extends Component<ICommandBarProps & IMixinSettingProps & IMixinStatusProps> {

    private handelChange = () => {
        this.forceUpdate();
    }

    componentDidMount() {
        if (this.props.status) {
            this.props.status.on("mouseModChange", this.handelChange)
        }
    }

    componentWillUnmount() {
        if (this.props.status) {
            this.props.status.off("mouseModChange", this.handelChange)
        }
    }

    render(): ReactNode {

        const mouseMod = this.props.status?.mouseMod ?? MouseMod.Drag;

        return <Theme
            className="command-bar"
            backgroundLevel={BackgroundLevel.Level2}
            style={{ width: this.props.width }}
            onClick={() => {
                if (this.props.setting) {
                    this.props.setting.layout.focus("");
                }
            }}
        >
            <div>
                {this.getRenderButton({ iconName: "Save", i18NKey: "Command.Bar.Save.Info" })}
                {this.getRenderButton({ iconName: "Play", i18NKey: "Command.Bar.Play.Info" })}
                {this.getRenderButton({
                    iconName: "HandsFree", i18NKey: "Command.Bar.Drag.Info", 
                    active: mouseMod === MouseMod.Drag,
                    click: () => this.props.status ? this.props.status.setMouseMod(MouseMod.Drag) : undefined
                })}
                {this.getRenderButton({
                    iconName: "TouchPointer", i18NKey: "Command.Bar.Select.Info",
                    active: mouseMod === MouseMod.click,
                    click: () => this.props.status ? this.props.status.setMouseMod(MouseMod.click) : undefined
                })}
                {this.getRenderButton({
                    iconName: "WebAppBuilderFragmentCreate",
                    i18NKey: "Command.Bar.Add.Group.Info",
                    click: () => this.props.status ? this.props.status.newGroup() : undefined
                })}
                {this.getRenderButton({
                    iconName: "CubeShape",
                    i18NKey: "Command.Bar.Add.Range.Info",
                    click: () => this.props.status ? this.props.status.newRange() : undefined
                })}
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
        active?: boolean;
    }): ReactNode {
        return <LocalizationTooltipHost 
            i18nKey={param.i18NKey}
            directionalHint={DirectionalHint.rightCenter}
        >
            <IconButton
                style={{ height: this.props.width }}
                iconProps={{ iconName: param.iconName }}
                onClick={ param.click }
                className={"command-button on-end" + (param.active ? " active" : "")}
            />
        </LocalizationTooltipHost>
    }
}

export { CommandBar };