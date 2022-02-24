import { Component, ReactNode } from "react";
import { SettingProvider, Setting } from "@Context/Setting";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
import { Theme, FontLevel, BackgroundLevel } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import { Entry } from "../Entry/Entry";
import "./SimulatorWeb.scss";

class SimulatorWeb extends Component {
    
    /**
     * 全局设置
     */
    private setting: Setting;

    public constructor(props: any) {
        super(props);

        // TODO: 这里要读取设置
        this.setting = new Setting();
        (window as any).setting = (this.setting as any);
    }

    public render(): ReactNode {
        return <SettingProvider value={this.setting}>
            <HeaderBar/>
            <Theme 
                className="test" 
                fontLevel={FontLevel.Level2}
                backgroundLevel={BackgroundLevel.Level1}
            >
                Theme
            </Theme>
            <Localization i18nKey="EN_US"/>
        </SettingProvider>
    }
}

Entry.renderComponent(SimulatorWeb);