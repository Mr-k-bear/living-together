import { useSettingWithEvent, Themes, IMixinSettingProps, Setting } from "@Context/Setting";
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

function getClassList(props: IThemeProps, setting?: Setting) {
    const classNameList: string[] = [];

    if (props.className) {
        classNameList.push(props.className);
    }

    const theme = setting ? setting.themes : Themes.dark;
    classNameList.push(theme === Themes.light ? "light" : "dark");

    if (props.fontLevel) {
        classNameList.push(`font-${props.fontLevel}`);
    }
    
    if (props.backgroundLevel) {
        classNameList.push(`background-${props.backgroundLevel}`);
    }

    return classNameList;
}

/**
 * 主题切换
 */
@useSettingWithEvent("themes")
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
        const classNameList = getClassList(this.props, setting);

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
export { Theme, FontLevel, BackgroundLevel, getClassList };