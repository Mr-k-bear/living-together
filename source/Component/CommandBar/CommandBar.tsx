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
import { ArchiveSave } from "@Context/Archive";
import "./CommandBar.scss";

const COMMAND_BAR_WIDTH = 45;

interface IRenderButtonParameter {
    i18NKey: AllI18nKeys;
    iconName?: string;
    click?: () => void;
    active?: boolean;
}

interface ICommandBarState {
    isSaveRunning: boolean;
}

function getRenderButton(param: IRenderButtonParameter): ReactNode {
    return <LocalizationTooltipHost 
        i18nKey={param.i18NKey}
        directionalHint={DirectionalHint.rightCenter}
    >
        <IconButton
            style={{ height: COMMAND_BAR_WIDTH }}
            iconProps={{ iconName: param.iconName }}
            onClick={ param.click }
            className={"command-button on-end" + (param.active ? " active" : "")}
        />
    </LocalizationTooltipHost>
}
@useSetting
@useStatusWithEvent("mouseModChange", "actuatorStartChange")
class CommandBar extends Component<IMixinSettingProps & IMixinStatusProps, ICommandBarState> {

    public state: Readonly<ICommandBarState> = {
        isSaveRunning: false
    };

    public render(): ReactNode {

        const mouseMod = this.props.status?.mouseMod ?? MouseMod.Drag;

        return <Theme
            className="command-bar"
            backgroundLevel={BackgroundLevel.Level2}
            style={{ width: COMMAND_BAR_WIDTH }}
            onClick={() => {
                if (this.props.setting) {
                    this.props.setting.layout.focus("");
                }
            }}
        >
            <div>

                <ArchiveSave
                    running={this.state.isSaveRunning}
                    afterRunning={() => {
                        this.setState({ isSaveRunning: false });
                    }}
                />

                {getRenderButton({
                    iconName: "Save",
                    i18NKey: "Command.Bar.Save.Info",
                    click: () => {
                        this.setState({
                            isSaveRunning: true
                        });
                    }
                })}

                {getRenderButton({
                    iconName: this.props.status?.actuator.start() ? "Pause" : "Play",
                    i18NKey: "Command.Bar.Play.Info",
                    click: () => this.props.status ? this.props.status.actuator.start(
                        !this.props.status.actuator.start()
                    ) : undefined
                })}

                {getRenderButton({
                    iconName: "HandsFree", i18NKey: "Command.Bar.Drag.Info", 
                    active: mouseMod === MouseMod.Drag,
                    click: () => this.props.status ? this.props.status.setMouseMod(MouseMod.Drag) : undefined
                })}

                {getRenderButton({
                    iconName: "TouchPointer", i18NKey: "Command.Bar.Select.Info",
                    active: mouseMod === MouseMod.click,
                    click: () => this.props.status ? this.props.status.setMouseMod(MouseMod.click) : undefined
                })}

                {getRenderButton({
                    iconName: "WebAppBuilderFragmentCreate",
                    i18NKey: "Command.Bar.Add.Group.Info",
                    click: () => {
                        this.props.status ? this.props.status.newGroup() : undefined;
                    }
                })}

                {getRenderButton({
                    iconName: "ProductVariant",
                    i18NKey: "Command.Bar.Add.Range.Info",
                    click: () => {
                        this.props.status ? this.props.status.newRange() : undefined;
                    }
                })}

                {getRenderButton({
                    iconName: "Running",
                    i18NKey: "Command.Bar.Add.Behavior.Info",
                    click: () => {
                        this.props.status?.popup.showPopup(BehaviorPopup, {});
                    }
                })}

                {getRenderButton({
                    iconName: "Tag",
                    i18NKey: "Command.Bar.Add.Tag.Info",
                    click: () => {
                        this.props.status ? this.props.status.newLabel() : undefined;
                    }
                })}

                {getRenderButton({ iconName: "Camera", i18NKey: "Command.Bar.Camera.Info" })}
            </div>
            <div>
                {getRenderButton({
                    iconName: "Settings",
                    i18NKey: "Command.Bar.Setting.Info",
                    click: () => {
                        this.props.status?.popup.showPopup(SettingPopup, {});
                    }
                })}
            </div>
        </Theme>
    }
}

export { CommandBar };