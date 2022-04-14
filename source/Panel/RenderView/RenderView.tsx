import { Component, ReactNode, createRef } from "react";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps, Themes, Platform } from "@Context/Setting";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import "./RenderView.scss";

interface IRendererFpsViewProps {
    renderFps: number;
    physicsFps: number;
}

@useStatus
class RendererFpsView extends Component<IMixinStatusProps, IRendererFpsViewProps> {

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
            let newState: IRendererFpsViewProps = {} as any;
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

        return <Theme
            className="render-view-fps"
            fontLevel={FontLevel.normal}
        >
            <div className="fps-view">
                <Localization i18nKey="Header.Bar.Fps.Render.Info" options={{
                    fps: fpsInfo.renderFps
                }}/><br/>
                <Localization i18nKey="Header.Bar.Fps.Simulate.Info" options={{
                    fps: fpsInfo.physicsFps
                }}/>
            </div>
        </Theme>;
    }
}

@useSetting
@useStatus
class RenderView extends Component<IMixinStatusProps & IMixinSettingProps> {

	private rootEle = createRef<HTMLDivElement>();

	public render(): ReactNode {
		const theme = this.props.setting?.themes ?? Themes.dark;
		const classList: string[] = ["render-view", "background-lvl5"];
		if (theme === Themes.light) classList.push("light");
		if (theme === Themes.dark) classList.push("dark");

		if (this.props.status) {
			(this.props.status.renderer as ClassicRenderer).cleanColor = 
			(theme === Themes.dark) ?
				[27 / 255, 26 / 255, 25 / 255, 1] :
				[190 / 255, 187 / 255, 184 / 255, 1]
		}

		return <>
            {
                this.props.setting?.platform === Platform.desktop ?
                    <RendererFpsView/> : null
            }
            <div ref={this.rootEle} className={classList.join(" ")}/>;
        </>
	}

	public componentDidMount() {
		let div = this.rootEle.current;
		if (div && (!div.childNodes || div.childNodes.length <= 0) && this.props.status) {	
			div.appendChild(this.props.status.renderer.dom);
		}
	}
}

export { RenderView }