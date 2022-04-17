import { Component, ReactNode } from "react";
import { SettingProvider, Setting, Platform } from "@Context/Setting";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { ISimulatorAPI } from "@Electron/SimulatorAPI";
import { StatusProvider, Status } from "@Context/Status";
import { ElectronProvider } from "@Context/Electron";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RootContainer } from "@Component/Container/RootContainer";
import { LayoutDirection } from "@Context/Layout";
import { CommandBar } from "@Component/CommandBar/CommandBar";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Popup } from "@Component/Popup/Popup";
import { Entry } from "../Entry/Entry";
import { Group } from "@Model/Group";
import "./SimulatorDesktop.scss";

initializeIcons("./font-icon/");

class SimulatorDesktop extends Component {

    /**
     * Electron API
     */
    public electron: ISimulatorAPI;
    
    /**
     * 全局设置
     */
    private setting: Setting;

    /**
     * 全局状态
     */
    private status: Status;

    public constructor(props: any) {
        super(props);

        // TODO: 这里要读取设置
        this.setting = new Setting();
        this.setting.platform = Platform.desktop;

        // TODO: 这里要读取存档
        const classicRender = new ClassicRenderer().onLoad();
        this.status = new Status();
        this.status.bindRenderer(classicRender);
        this.status.setting = this.setting;

        const randomPosition = (group: Group) => {
            group.individuals.forEach((individual) => {
                individual.position[0] = (Math.random() - .5) * 2;
                individual.position[1] = (Math.random() - .5) * 2;
                individual.position[2] = (Math.random() - .5) * 2;
            })
        };

        (window as any).setting = this.setting;
        (window as any).status = this.status;

        this.electron = {} as ISimulatorAPI;
        if ((window as any).API) {
            this.electron = (window as any).API;
        } else {
            console.error("SimulatorDesktop: Can't find electron API");
        }
    }

    public componentDidMount() {
        this.setting.layout.setData({
            items: [
                {
                    items: [
                        {panels: ["RenderView"]},
                        {
                            items: [{panels: ["BehaviorList"]}, {panels: ["LabelList"]}],
                            scale: 80,
                            layout: LayoutDirection.X
                        }
                    ],
                    scale: 60,
                    layout: LayoutDirection.Y
                },
                {
                    items: [{
                        panels: ["ObjectList"]
                    }, {
                        panels: ["GroupDetails", "RangeDetails", "LabelDetails", "BehaviorDetails"]
                    }],
                    scale: 30,
                    layout: LayoutDirection.Y
                }
            ],
            scale: 60,
            layout: LayoutDirection.X
        })
    }

    public render(): ReactNode {
        return <SettingProvider value={this.setting}>
            <StatusProvider value={this.status}>
                <ElectronProvider value={this.electron}>
                    {this.renderContent()}
                </ElectronProvider>
            </StatusProvider>
        </SettingProvider>
    }

    private renderContent(): ReactNode {
        return <Theme 
            className="app-root"
            backgroundLevel={BackgroundLevel.Level5}
            fontLevel={FontLevel.Level3}
        >
            <Popup/>
            <HeaderBar height={35}/>
            <div className="app-root-space" style={{
                height: `calc( 100% - ${35}px)`
            }}>
                <CommandBar width={45}/>
                <RootContainer />
            </div>
        </Theme>
    }
}

Entry.renderComponent(SimulatorDesktop);