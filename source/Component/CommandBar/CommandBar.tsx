import { Component, ReactNode } from "react";
import { DirectionalHint, IconButton } from "@fluentui/react";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { LocalizationTooltipHost } from "@Component/Localization/LocalizationTooltipHost";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { SettingPopup } from "@Component/SettingPopup/SettingPopup";
import { BehaviorPopup } from "@Component/BehaviorPopup/BehaviorPopup";
import { MouseMod } from "@GLRender/ClassicRenderer";
import "./CommandBar.scss";

interface ICommandBarProps {
    width: number;
}

@useSetting
@useStatusWithEvent("mouseModChange", "actuatorStartChange")
class CommandBar extends Component<ICommandBarProps & IMixinSettingProps & IMixinStatusProps> {

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
                {this.getRenderButton({
                    iconName: "Save",
                    i18NKey: "Command.Bar.Save.Info",
                    click: () => {
                        this.props.status?.archive.save(this.props.status.model);
                    }
                })}
                {this.getRenderButton({
                    iconName: this.props.status?.actuator.start() ? "Pause" : "Play",
                    i18NKey: "Command.Bar.Play.Info",
                    click: () => this.props.status ? this.props.status.actuator.start(
                        !this.props.status.actuator.start()
                    ) : undefined
                })}
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
                    click: () => {
                        this.props.status ? this.props.status.newGroup() : undefined;
                    }
                })}
                {this.getRenderButton({
                    iconName: "ProductVariant",
                    i18NKey: "Command.Bar.Add.Range.Info",
                    click: () => {
                        this.props.status ? this.props.status.newRange() : undefined;
                    }
                })}
                {this.getRenderButton({
                    iconName: "Running",
                    i18NKey: "Command.Bar.Add.Behavior.Info",
                    click: () => {
                        this.props.status?.popup.showPopup(BehaviorPopup, {});
                    }
                })}
                {this.getRenderButton({
                    iconName: "Tag",
                    i18NKey: "Command.Bar.Add.Tag.Info",
                    click: () => {
                        this.props.status ? this.props.status.newLabel() : undefined;
                    }
                })}
                {this.getRenderButton({ iconName: "Camera", i18NKey: "Command.Bar.Camera.Info" })}
            </div>
            <div>
                {this.getRenderButton({
                    iconName: "Settings",
                    i18NKey: "Command.Bar.Setting.Info",
                    click: () => {
                        this.props.status?.popup.showPopup(SettingPopup, {});
                    }
                })}
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