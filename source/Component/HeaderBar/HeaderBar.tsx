import { Component, ReactNode } from "react";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { Theme, BackgroundLevel, FontLevel } from "@Component/Theme/Theme";
import "./HeaderBar.scss";

interface IHeaderBarProps {
    height: number;
}

/**
 * 头部信息栏
 */
@useStatus
class HeaderBar extends Component<IHeaderBarProps & IMixinStatusProps> {

    private changeListener = () => {
        this.forceUpdate();
    }

    public componentDidMount() {

    }

    public componentWillUnmount() {
        
    }

    public render(): ReactNode {
        return <Theme
            className="header-bar"
            backgroundLevel={BackgroundLevel.Level1}
            fontLevel={FontLevel.Level3}
            style={{ height: this.props.height }}
        >
            <div>Living Together | Web</div>
        </Theme>
    }
}

export default HeaderBar;
export { HeaderBar };