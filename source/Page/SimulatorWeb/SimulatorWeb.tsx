import { Component, ReactNode } from "react";
import { SettingProvider, Setting } from "@Context/Setting";
import { HeaderBar } from "@Component/HeaderBar/HeaderBar";
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
        </SettingProvider>
    }
}

Entry.renderComponent(SimulatorWeb);