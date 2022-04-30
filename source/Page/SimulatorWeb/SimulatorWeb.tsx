import { Component, ReactNode } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SettingProvider, Setting, Platform } from "@Context/Setting";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { StatusProvider, Status } from "@Context/Status";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RootContainer } from "@Component/Container/RootContainer";
import { LayoutDirection } from "@Context/Layout";
import { LoadFile } from "@Component/LoadFile/LoadFile";
import { CommandBar } from "@Component/CommandBar/CommandBar";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Popup } from "@Component/Popup/Popup";
import { Entry } from "../Entry/Entry";
import "./SimulatorWeb.scss";

initializeIcons("https://img.mrkbear.com/fabric-cdn-prod_20210407.001/");

class SimulatorWeb extends Component {
    
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
        this.setting.platform = Platform.web;

        // TODO: 这里要读取存档
        const classicRender = new ClassicRenderer().onLoad();
        this.status = new Status();
        this.status.bindRenderer(classicRender);
        this.status.setting = this.setting;

        (window as any).LT = {
            status: this.status,
            setting: this.setting
        };
    }

    public componentDidMount() {
        this.setting.layout.setData({
            items: [
                {
                    items: [
                        {panels: ["RenderView"]},
                        {
                            items: [{panels: ["ClipPlayer", "BehaviorList"]}, {panels: ["LabelList"]}],
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
                <DndProvider backend={HTML5Backend}>
                    {this.renderContent()}
                </DndProvider>
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
            <LoadFile>
                <HeaderBar height={45}/>
                <div className="app-root-space" style={{
                    height: `calc( 100% - ${45}px)`
                }}>
                    <CommandBar/>
                    <RootContainer/>
                </div>
            </LoadFile>
        </Theme>
    }
}

Entry.renderComponent(SimulatorWeb);