import { Component, ReactNode, FunctionComponent } from "react";
import { DirectionalHint, Icon, Spinner } from "@fluentui/react";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { LocalizationTooltipHost } from "@Component/Localization/LocalizationTooltipHost";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { SettingPopup } from "@Component/SettingPopup/SettingPopup";
import { BehaviorPopup } from "@Component/BehaviorPopup/BehaviorPopup";
import { MouseMod } from "@GLRender/ClassicRenderer";
import { ArchiveSave } from "@Context/Archive";
import { ActuatorModel } from "@Model/Actuator";
import "./CommandBar.scss";

const COMMAND_BAR_WIDTH = 45;

interface IRenderButtonParameter {
    i18NKey: AllI18nKeys;
    iconName?: string;
    click?: () => void;
    active?: boolean;
    isLoading?: boolean;
}

interface ICommandBarState {
    isSaveRunning: boolean;
}

const CommandButton: FunctionComponent<IRenderButtonParameter> = (param) => {
    return <LocalizationTooltipHost 
        i18nKey={param.i18NKey}
        directionalHint={DirectionalHint.rightCenter}
    >
        <div
            style={{ height: COMMAND_BAR_WIDTH }}
            onClick={ param.isLoading ? undefined : param.click }
            className={"command-button on-end" + (param.active ? " active" : "")}
        >
            {param.isLoading ? 
                <Spinner className="command-button-loading"/> :
                <Icon iconName={param.iconName}/>
            }
        </div>
    </LocalizationTooltipHost>
}
@useSetting
@useStatusWithEvent("mouseModChange", "actuatorStartChange")
class CommandBar extends Component<IMixinSettingProps & IMixinStatusProps, ICommandBarState> {

    public state: Readonly<ICommandBarState> = {
        isSaveRunning: false
    };

    private renderPlayActionButton(): ReactNode {

        let icon: string = "Play";
        let handel: () => any = () => {};

        // 播放模式
        if (this.props.status?.focusClip) {

            // 暂停播放
            if (this.props.status?.actuator.mod === ActuatorModel.Play) {
                icon = "Pause";
                handel = () => {
                    this.props.status?.actuator.pausePlay();
					console.log("ClipRecorder: Pause play...");
                };
            }

            // 开始播放
            else {
                icon = "Play";
                handel = () => {
                    this.props.status?.actuator.playing();
					console.log("ClipRecorder: Play start...");
                };
            }
        }
        
        // 正在录制中
        else if (
            this.props.status?.actuator.mod === ActuatorModel.Record ||
			this.props.status?.actuator.mod === ActuatorModel.Offline
        ) {

            // 暂停录制
            icon = "Stop";
            handel = () => {
                this.props.status?.actuator.endRecord();
                console.log("ClipRecorder: Rec end...");
            };
        }

        // 正常控制主时钟
        else {
            icon = this.props.status?.actuator.start() ? "Pause" : "Play";
            handel = () => this.props.status?.actuator.start(
                !this.props.status?.actuator.start()
            );
        }

        return <CommandButton
            iconName={icon}
            i18NKey="Command.Bar.Play.Info"
            click={handel}
        />;
    }

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

                <CommandButton
                    iconName="Save"
                    i18NKey="Command.Bar.Save.Info"
                    isLoading={this.state.isSaveRunning}
                    click={() => {
                        this.setState({
                            isSaveRunning: true
                        });
                    }}
                />

                {this.renderPlayActionButton()}

                <CommandButton
                    iconName="HandsFree"
                    i18NKey="Command.Bar.Drag.Info"
                    active={mouseMod === MouseMod.Drag}
                    click={() => this.props.status ? this.props.status.setMouseMod(MouseMod.Drag) : undefined}
                />

                <CommandButton
                    iconName="TouchPointer"
                    i18NKey="Command.Bar.Select.Info"
                    active={mouseMod === MouseMod.click}
                    click={() => this.props.status ? this.props.status.setMouseMod(MouseMod.click) : undefined}
                />

                <CommandButton
                    iconName="WebAppBuilderFragmentCreate"
                    i18NKey="Command.Bar.Add.Group.Info"
                    click={() => {
                        this.props.status ? this.props.status.newGroup() : undefined;
                    }}
                />

                <CommandButton
                    iconName="ProductVariant"
                    i18NKey="Command.Bar.Add.Range.Info"
                    click={() => {
                        this.props.status ? this.props.status.newRange() : undefined;
                    }}
                />

                <CommandButton
                    iconName="Running"
                    i18NKey="Command.Bar.Add.Behavior.Info"
                    click={() => {
                        this.props.status?.popup.showPopup(BehaviorPopup, {});
                    }}
                />

                <CommandButton
                    iconName="Tag"
                    i18NKey="Command.Bar.Add.Tag.Info"
                    click={() => {
                        this.props.status ? this.props.status.newLabel() : undefined;
                    }}
                />
            </div>
            <div>
                <CommandButton
                    iconName="Settings"
                    i18NKey="Command.Bar.Setting.Info"
                    click={() => {
                        this.props.status?.popup.showPopup(SettingPopup, {});
                    }}
                />
            </div>
        </Theme>
    }
}

export { CommandBar };