import { Component, ReactNode } from "react";
import { SettingProvider, Setting, Platform } from "@Context/Setting";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import { StatusProvider, Status } from "@Context/Status";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RootContainer } from "@Component/Container/RootContainer";
import { LayoutDirection } from "@Context/Layout";
import { AllBehaviors, getBehaviorById } from "@Behavior/Behavior";
import { CommandBar } from "@Component/CommandBar/CommandBar";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Popup } from "@Component/Popup/Popup";
import { Entry } from "../Entry/Entry";
import { Group } from "@Model/Group";
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

        const randomPosition = (group: Group) => {
            group.individuals.forEach((individual) => {
                individual.position[0] = (Math.random() - .5) * 2;
                individual.position[1] = (Math.random() - .5) * 2;
                individual.position[2] = (Math.random() - .5) * 2;
            })
        };

        // 测试代码
        if (false) {
            let group = this.status.newGroup();
            let range = this.status.newRange();
            range.color = [.1, .5, .9];
            group.new(100);
            group.color = [.8, .1, .6];
            randomPosition(group);
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
            boundary.parameter.range.picker = this.status.model.allRangeLabel;
            group.addBehavior(template);
            group.addBehavior(dynamic);
            group.addBehavior(brownian);
            group.addBehavior(boundary);
        }

        // 鱼群模型测试
        if (false) {
            let fish1 = this.status.newGroup();
            let fish2 = this.status.newGroup();
            let shark = this.status.newGroup();
            let range = this.status.newRange();

            range.displayName = "Experimental site";
            range.color = [.8, .1, .6];

            fish1.new(100);
            fish1.displayName = "Fish A";            
            fish1.color = [.1, .5, .9];
            randomPosition(fish1);

            fish2.new(50);
            fish2.displayName = "Fish B";            
            fish2.color = [.3, .2, .9];
            randomPosition(fish2);

            shark.new(3);
            shark.displayName = "Shark";
            shark.color = [.8, .2, .3];
            shark.renderParameter.size = 100;
            shark.renderParameter.shape = "5";
            randomPosition(shark);

            this.status.model.update(0);
            let fishLabel = this.status.newLabel();
            fishLabel.name = "Fish";
            fish1.addLabel(fishLabel);
            fish2.addLabel(fishLabel);

            let template = this.status.model.addBehavior(getBehaviorById("Template"));
            template.name = "Template"; template.color = [150, 20, 220];

            let dynamicFish = this.status.model.addBehavior(getBehaviorById("PhysicsDynamics"));
            dynamicFish.name = "Dynamic Fish"; dynamicFish.color = [250, 200, 80];

            let dynamicShark = this.status.model.addBehavior(getBehaviorById("PhysicsDynamics"));
            dynamicShark.name = "Dynamic Shark"; dynamicShark.color = [250, 200, 80];
            dynamicShark.parameter.maxAcceleration = 8.5;
            dynamicShark.parameter.maxVelocity = 15.8;
            dynamicShark.parameter.resistance = 3.6;

            let brownian = this.status.model.addBehavior(getBehaviorById("Brownian"));
            brownian.name = "Brownian"; brownian.color = [200, 80, 250];

            let boundary = this.status.model.addBehavior(getBehaviorById("BoundaryConstraint"));
            boundary.name = "Boundary"; boundary.color = [80, 200, 250];
            boundary.parameter.range.picker = this.status.model.allRangeLabel;

            let tracking = this.status.model.addBehavior(getBehaviorById("Tracking"));
            tracking.name = "Tracking"; tracking.color = [80, 200, 250];
            tracking.parameter.target.picker = fishLabel;

            let attacking = this.status.model.addBehavior(getBehaviorById("ContactAttacking"));
            attacking.name = "Contact Attacking"; attacking.color = [120, 100, 250];
            attacking.parameter.target.picker = fishLabel;

            fish1.addBehavior(dynamicFish);
            fish1.addBehavior(brownian);
            fish1.addBehavior(boundary);

            fish2.addBehavior(dynamicFish);
            fish2.addBehavior(brownian);
            fish2.addBehavior(boundary);

            shark.addBehavior(dynamicShark);
            shark.addBehavior(boundary);
            shark.addBehavior(tracking);
            shark.addBehavior(attacking);

            setTimeout(() => {
                this.status.model.updateBehaviorParameter();
            }, 200)
        }

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
                <CommandBar/>
                <RootContainer/>
            </div>
        </Theme>
    }
}

Entry.renderComponent(SimulatorWeb);