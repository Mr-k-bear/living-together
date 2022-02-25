import { Component, ReactNode } from "react";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { Icon } from '@fluentui/react/lib/Icon';
import { I18N } from "../Localization/Localization";
import "./HeaderBar.scss";
import { Tooltip, TooltipHost } from "@fluentui/react";

interface IHeaderBarProps {
    height: number;
}

interface HeaderBarState {
    renderFps: number;
    physicsFps: number;
}

/**
 * 头部信息栏
 */
@useSetting
@useStatus
class HeaderBar extends Component<
    IHeaderBarProps & IMixinStatusProps & IMixinSettingProps,
    HeaderBarState
> {

    public state = {
        renderFps: 0,
        physicsFps: 0,
    }

    private changeListener = () => {
        this.forceUpdate();
    }

    private updateTime: number = 0;

    private createFpsCalc(type: "renderFps" | "physicsFps") {
        return (t: number) => {
            let newState: HeaderBarState = {} as any;
            newState[type] = 1 / t;
            if (this.updateTime > 60) {
                this.updateTime = 0;
                this.setState(newState);
            }
            this.updateTime ++;
        }
    }

    private renderFpsCalc: (t: number) => void = () => {};
    private physicsFpsCalc: (t: number) => void = () => {};

    public componentDidMount() {
        const { setting, status } = this.props;
        this.renderFpsCalc = this.createFpsCalc("renderFps");
        this.physicsFpsCalc = this.createFpsCalc("physicsFps");
        if (setting) {
            setting.on("language", this.changeListener);
        }
        if (status) {
            status.archive.on("save", this.changeListener);
            status.model.on("loop", this.physicsFpsCalc);
            status.renderer.on("loop", this.renderFpsCalc);
        }
    }

    public componentWillUnmount() {
        const { setting, status } = this.props;
        if (setting) {
            setting.off("language", this.changeListener);
        }
        if (status) {
            status.archive.off("save", this.changeListener);
            status.model.off("loop", this.physicsFpsCalc);
            status.renderer.off("loop", this.renderFpsCalc);
        }
    }

    public render(): ReactNode {
        const { status } = this.props;
        let fileName: string = "";
        let isNewFile: boolean = true;
        let isSaved: boolean = false;
        if (status) {
            isNewFile = status.archive.isNewFile;
            fileName = status.archive.fileName ?? "";
            isSaved = status.archive.isSaved;
        }

        const fpsInfo = {
            renderFps: Math.floor(this.state.renderFps).toString(),
            physicsFps: Math.floor(this.state.physicsFps).toString()
        };

        return <Theme
            className="header-bar"
            backgroundLevel={BackgroundLevel.Level1}
            fontLevel={FontLevel.Level3}
            style={{ height: this.props.height }}
        >
            <TooltipHost content={I18N(this.props, "Header.Bar.Title.Info")}>
                <div className="title">
                    <Icon iconName="HomeGroup"></Icon>
                    <span>{I18N(this.props, "Header.Bar.Title")}</span>
                </div>
            </TooltipHost>
            <TooltipHost content={I18N(this.props, "Header.Bar.File.Name.Info", {
                file: isNewFile ? I18N(this.props, "Header.Bar.New.File.Name") : fileName,
                status: isSaved ? I18N(this.props, "Header.Bar.File.Save.Status.Saved") : 
                    I18N(this.props, "Header.Bar.File.Save.Status.Unsaved")
            })}>
                <div className="file-name">{
                    isNewFile ? I18N(this.props, "Header.Bar.New.File.Name") : fileName
                }{
                    isSaved ? "" : "*"
                }</div>
            </TooltipHost>
            <TooltipHost content={I18N(this.props, "Header.Bar.Fps.Info", fpsInfo)}>
                <div className="fps-view">
                    <Icon iconName="SpeedHigh"></Icon>
                    <span>{I18N(this.props, "Header.Bar.Fps", fpsInfo)}</span>
                </div>
            </TooltipHost>
        </Theme>
    }
}

export default HeaderBar;
export { HeaderBar };