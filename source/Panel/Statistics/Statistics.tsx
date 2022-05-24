import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import Theme from "@Component/Theme/Theme";
import "./Statistics.scss";

interface IStatisticsProps {

}

@useSetting
@useStatusWithEvent("labelChange", "focusLabelChange", "labelAttrChange")
class Statistics extends Component<IStatisticsProps & IMixinStatusProps & IMixinSettingProps> {

    public render(): ReactNode {
        return <Theme className="statistics-panel">

        </Theme>;
    }
}

export { Statistics };