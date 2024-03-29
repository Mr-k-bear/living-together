import { Component, ReactNode } from "react";
import { Icon } from '@fluentui/react/lib/Icon';
import { useStatusWithEvent, useStatus, IMixinStatusProps } from "@Context/Status";
import { useSettingWithEvent, IMixinSettingProps, Platform } from "@Context/Setting";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { LocalizationTooltipHost } from "@Component/Localization/LocalizationTooltipHost";
import { useElectronWithEvent, IMixinElectronProps } from "@Context/Electron";
import { I18N } from "@Component/Localization/Localization";
import "./HeaderBar.scss";

interface IHeaderBarProps {
    height: number;
}

interface IHeaderFpsViewState {
    renderFps: number;
    physicsFps: number;
}

@useStatus
class HeaderFpsView extends Component<IMixinStatusProps & IMixinSettingProps, IHeaderFpsViewState> {

    public state = {
        renderFps: 0,
        physicsFps: 0,
    }

    private updateTime: number = 0;

    private renderFpsCalc: (t: number) => void = () => {};
    private physicsFpsCalc: (t: number) => void = () => {};

    public componentDidMount() {
        const { status } = this.props;
        this.renderFpsCalc = this.createFpsCalc("renderFps");
        this.physicsFpsCalc = this.createFpsCalc("physicsFps");
        if (status) {
            status.on("physicsLoop", this.physicsFpsCalc);
            status.on("renderLoop", this.renderFpsCalc);
        }
    }

    public componentWillUnmount() {
        const { status } = this.props;
        if (status) {
            status.off("physicsLoop", this.physicsFpsCalc);
            status.off("renderLoop", this.renderFpsCalc);
        }
    }

    private createFpsCalc(type: "renderFps" | "physicsFps") {
        return (t: number) => {
            if (t === 0) {
                return;
            }
            let newState: IHeaderFpsViewState = {} as any;
            newState[type] = 1 / t;
            if (this.updateTime > 20) {
                this.updateTime = 0;
                this.setState(newState);
            }
            this.updateTime ++;
        }
    }

    public render() {

        const fpsInfo = {
            renderFps: Math.floor(this.state.renderFps).toString(),
            physicsFps: Math.floor(this.state.physicsFps).toString()
        };

        return <LocalizationTooltipHost i18nKey="Header.Bar.Fps.Info" options={fpsInfo}>
                <div className="fps-view">
                    <Icon iconName="SpeedHigh"></Icon>
                    <span>{I18N(this.props, "Header.Bar.Fps", fpsInfo)}</span>
                </div>
        </LocalizationTooltipHost>
    }
}

@useElectronWithEvent("windowsSizeStateChange")
class HeaderWindowsAction extends Component<IMixinElectronProps> {

    public render() {

        const isMaxSize = this.props.electron?.isMaximized();

        return <Theme className="header-windows-action">
            <div
                className="action-button"
                onClick={() => {
                    this.props.electron?.minimize();
                }}
            >
                <Icon iconName="Remove"/>
            </div>
            <div
                className="action-button"
                onClick={() => {
                    if (isMaxSize) {
                        this.props.electron?.unMaximize();
                    } else {
                        this.props.electron?.maximize();
                    }
                }}
            >
                <Icon iconName={ isMaxSize ? "ArrangeSendBackward" : "Checkbox"}/>
            </div>
            <div
                className="action-button close-button"
                onClick={() => {
                    this.props.electron?.close()
                }}
            >
                <Icon iconName="Clear"/>
            </div>
        </Theme>
    }
}

/**
 * 头部信息栏
 */
@useSettingWithEvent("language")
@useStatusWithEvent("fileSave", "fileChange", "fileLoad")
class HeaderBar extends Component<IHeaderBarProps & IMixinStatusProps & IMixinSettingProps> {

    private showCloseMessage = (e: BeforeUnloadEvent) => {
        if (!this.props.status?.archive.isSaved) {
            const message = I18N(this.props, "Info.Hint.Save.After.Close");
            (e || window.event).returnValue = message; // 兼容 Gecko + IE
            return message; // 兼容 Gecko + Webkit, Safari, Chrome
        }
    }

    public componentDidMount() {

        if (this.props.setting?.platform === Platform.web) {
            // 阻止页面关闭
            window.addEventListener("beforeunload", this.showCloseMessage);
        }
    }

    public componentWillUnmount() {

        if (this.props.setting?.platform === Platform.web) {
            // 阻止页面关闭
            window.removeEventListener("beforeunload", this.showCloseMessage);
        }
    }

    public render(): ReactNode {
        const { status, setting } = this.props;

        let fileName: string = "";
        let isNewFile: boolean = true;
        let isSaved: boolean = false;

        if (status) {
            isNewFile = status.archive.isNewFile;
            fileName = status.archive.fileName ?? "";
            isSaved = status.archive.isSaved;
        }

        const headerBarClassName = ["header-bar"];
        if (setting?.platform === Platform.desktop) {
            headerBarClassName.push("desktop-header-bar");
        }

        return <Theme
            className={headerBarClassName.join(" ")}
            backgroundLevel={BackgroundLevel.Level1}
            fontLevel={FontLevel.Level3}
            style={{ height: this.props.height }}
            onClick={() => {
                if (this.props.setting) {
                    this.props.setting.layout.focus("");
                }
            }}
        >
            <LocalizationTooltipHost i18nKey="Header.Bar.Title.Info">
                <div className="title">
                    <Icon iconName="HomeGroup"></Icon>
                    <span>{I18N(this.props, "Header.Bar.Title")}</span>
                </div>
            </LocalizationTooltipHost>
            <LocalizationTooltipHost i18nKey="Header.Bar.File.Name.Info"
                options={{
                    file: isNewFile ? I18N(this.props, "Header.Bar.New.File.Name") : fileName,
                    status: isSaved ? I18N(this.props, "Header.Bar.File.Save.Status.Saved") : 
                        I18N(this.props, "Header.Bar.File.Save.Status.Unsaved")
                }}
            >
                <div className="file-name">{
                    isNewFile ? I18N(this.props, "Header.Bar.New.File.Name") : fileName
                }{
                    isSaved ? "" : "*"
                }</div>
            </LocalizationTooltipHost>

            {
                setting?.platform === Platform.desktop ?
                    <HeaderWindowsAction/> :
                    <HeaderFpsView setting={setting}/>
            }
            
        </Theme>
    }
}

export { HeaderBar };