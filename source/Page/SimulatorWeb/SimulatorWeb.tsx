import { Component, ReactNode } from "react";
import { SettingProvider, Setting } from "@Context/Setting";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { Entry } from "../Entry/Entry";
import { StatusProvider, Status } from "@Context/Status";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RootContainer } from "@Component/Container/RootContainer";
import { LayoutDirection } from "@Context/Layout";
import { CommandBar } from "@Component/CommandBar/CommandBar";
import { Popup } from "@Component/Popup/Popup";
import { AllBehaviors } from "@Behavior/Behavior";
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
        (window as any).setting = (this.setting as any);

        // TODO: 这里要读取存档
        this.status = new Status();
        this.status.renderer = new ClassicRenderer({ className: "canvas" }).onLoad();
        this.status.bindRenderer(this.status.renderer);
        this.status.setting = this.setting;

        // 测试代码
        if (true) {
            let group = this.status.newGroup();
            let range = this.status.newRange();
            range.color = [.1, .5, .9];
            group.new(100);
            group.color = [.8, .1, .6];
            group.individuals.forEach((individual) => {
                individual.position[0] = (Math.random() - .5) * 2;
                individual.position[1] = (Math.random() - .5) * 2;
                individual.position[2] = (Math.random() - .5) * 2;
            })
            this.status.model.update(0);
            this.status.newLabel().name = "New Label";
            this.status.newLabel().name = "Test Label 01";
            let template = this.status.model.addBehavior(AllBehaviors[0]);
            template.name = "Template"; template.color = [150, 20, 220];
            let dynamic = this.status.model.addBehavior(AllBehaviors[1]);
            dynamic.name = "Dynamic"; dynamic.color = [250, 200, 80];
            let brownian = this.status.model.addBehavior(AllBehaviors[2]);
            brownian.name = "Brownian"; brownian.color = [200, 80, 250];
            let boundary = this.status.model.addBehavior(AllBehaviors[3]);
            boundary.name = "Boundary"; boundary.color = [80, 200, 250];
            // boundary.parameter.range = this.status.model.allRangeLabel;
            group.addBehavior(template);
            group.addBehavior(dynamic);
            group.addBehavior(brownian);
            group.addBehavior(boundary);
        }

        (window as any).s = this;
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
                {this.renderContent()}
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
            <HeaderBar height={45}/>
            <div className="app-root-space" style={{
                height: `calc( 100% - ${45}px)`
            }}>
                <CommandBar width={45}/>
                <RootContainer />
            </div>
        </Theme>
    }
}

Entry.renderComponent(SimulatorWeb);