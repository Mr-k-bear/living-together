import { Component, ReactNode } from "react";
import { useSetting, IMixinSettingProps, Themes } from "@Context/Setting";

interface IHeaderBarProps {}

/**
 * 头部信息栏
 */
@useSetting
class HeaderBar extends Component<IHeaderBarProps & IMixinSettingProps> {

    private handelClick = () => {
        if (this.props.setting) {
            this.props.setting.setProps("themes", 
                this.props.setting.themes === Themes.dark ? Themes.light : Themes.dark
            );
            this.props.setting.setProps("language", 
                this.props.setting.language === "EN_US" ?'ZH_CN' : "EN_US"
            );
        }
    }

    private changeListener = () => {
        this.forceUpdate();
    }

    public componentDidMount() {
        console.log("mount");
        if (this.props.setting) {
            this.props.setting.on("change", this.changeListener);
        }
    }

    public componentWillUnmount() {
        console.log("die");
        if (this.props.setting) {
            this.props.setting.off("change", this.changeListener);
        }
    }

    public render(): ReactNode {
        return <div onClick={this.handelClick}>{this.props.setting?.themes}</div>
    }
}

export default HeaderBar;
export { HeaderBar };