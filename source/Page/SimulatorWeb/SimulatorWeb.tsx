import { Component, ReactNode } from "react";
import { SettingProvider, Setting } from "@Context/Setting";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Theme, FontLevel, BackgroundLevel } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import { Entry } from "../Entry/Entry";
import { StatusProvider, Status } from "@Context/Status";
import { ClassicRenderer } from "@GLRender/ClassicRenderer";
import "./SimulatorWeb.scss";

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
        this.status.model.bindRenderer(this.status.renderer);

        // 测试代码
        if (true) {
            let group = this.status.model.addGroup();
            let range = this.status.model.addRange();
            range.color = [.1, .5, .9];
            group.new(100);
            group.color = [.8, .1, .6];
            group.individuals.forEach((individual) => {
                individual.position[0] = (Math.random() - .5) * 2;
                individual.position[1] = (Math.random() - .5) * 2;
                individual.position[2] = (Math.random() - .5) * 2;
            })
            this.status.model.update(0);
        }
    }

    public render(): ReactNode {
        return <SettingProvider value={this.setting}>
            <StatusProvider value={this.status}>
                {this.renderContent()}
            </StatusProvider>
        </SettingProvider>
    }

    private renderContent(): ReactNode {
        return <div className="app-root">
            <HeaderBar/>
            <Theme 
                className="test" 
                fontLevel={FontLevel.Level2}
                backgroundLevel={BackgroundLevel.Level1}
            >
                Theme
            </Theme>
            <Localization i18nKey="EN_US"/>
        </div>
    }
}

Entry.renderComponent(SimulatorWeb);