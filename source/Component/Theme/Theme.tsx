import { useSetting, Themes, IMixinSettingProps } from "@Context/Setting";
import { Component, ReactNode, DetailedHTMLProps, HTMLAttributes } from "react";
import "./Theme.scss";

enum FontLevel {
    normal = "normal",
    Level3 = "lvl3",
    Level2 = "lvl2",
    Level1 = "lvl1"
}

enum BackgroundLevel {
    Level5 = "lvl5",
    Level4 = "lvl4",
    Level3 = "lvl3",
    Level2 = "lvl2",
    Level1 = "lvl1"
}

interface IThemeProps {
    className?: string;
    fontLevel?: FontLevel;
    backgroundLevel?: BackgroundLevel;
} 

/**
 * 主题切换
 */
@useSetting
class Theme extends Component<
    IThemeProps & IMixinSettingProps & DetailedHTMLProps<
        HTMLAttributes<HTMLDivElement>, HTMLDivElement
    >
> {

    private handelThemeChange = () => {
        this.forceUpdate();
    }

    public componentDidMount() {
        if (this.props.setting) {
            this.props.setting.on("themes", this.handelThemeChange);
        }
    }

    public componentWillUnmount() {
        if (this.props.setting) {
            this.props.setting.off("themes", this.handelThemeChange);
        }
    }

    public render(): ReactNode {

        const setting = this.props.setting;
        const classNameList: string[] = [];

        if (this.props.className) {
            classNameList.push(this.props.className);
        }

        const theme = setting ? setting.themes : Themes.dark;
        classNameList.push(theme === Themes.light ? "light" : "dark");

        if (this.props.fontLevel) {
            classNameList.push(`font-${this.props.fontLevel}`);
        }
        
        if (this.props.backgroundLevel) {
            classNameList.push(`background-${this.props.backgroundLevel}`);
        }

        const propsObj = {...this.props};
        delete propsObj.className;
        delete propsObj.setting;
        delete propsObj.backgroundLevel;
        delete propsObj.fontLevel;

        return <div {...propsObj} className={`${classNameList.join(" ")}`}>
            { this.props.children }
        </div>
    }
}

export default Theme;
export { Theme, FontLevel, BackgroundLevel };