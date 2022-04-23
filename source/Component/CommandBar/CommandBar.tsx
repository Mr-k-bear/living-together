import { Component, ReactNode } from "react";
import { DirectionalHint, IconButton } from "@fluentui/react";
import { useSetting, useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { LocalizationTooltipHost } from "@Component/Localization/LocalizationTooltipHost";
import { AllI18nKeys, I18N } from "@Component/Localization/Localization";
import { SettingPopup } from "@Component/SettingPopup/SettingPopup";
import { BehaviorPopup } from "@Component/BehaviorPopup/BehaviorPopup";
import { MouseMod } from "@GLRender/ClassicRenderer";
import * as download from "downloadjs";
import "./CommandBar.scss";

const COMMAND_BAR_WIDTH = 45;

function getRenderButton(param: {
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
            style={{ height: COMMAND_BAR_WIDTH }}
            iconProps={{ iconName: param.iconName }}
            onClick={ param.click }
            className={"command-button on-end" + (param.active ? " active" : "")}
        />
    </LocalizationTooltipHost>
}

@useSettingWithEvent("language")
@useStatusWithEvent()
class SaveCommandView extends Component<IMixinStatusProps & IMixinSettingProps> {

    public render(): ReactNode {
        return getRenderButton({
            iconName: "Save",
            i18NKey: "Command.Bar.Save.Info",
            click: () => {

                let fileName: string = "";
                let isNewFile: boolean = true;
                let isSaved: boolean = false;
        
                if (this.props.status) {
                    isNewFile = this.props.status.archive.isNewFile;
                    fileName = this.props.status.archive.fileName ?? "";
                    isSaved = this.props.status.archive.isSaved;
                }
                
                const file = this.props.status?.archive.save(this.props.status.model) ?? "";
                fileName = isNewFile ? I18N(this.props, "Header.Bar.New.File.Name") : fileName;
                download(file, fileName, "text/json");
            }
        })
    }
}

@useSetting
@useStatusWithEvent("mouseModChange", "actuatorStartChange")
class CommandBar extends Component<IMixinSettingProps & IMixinStatusProps> {

    render(): ReactNode {

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

                <SaveCommandView/>

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