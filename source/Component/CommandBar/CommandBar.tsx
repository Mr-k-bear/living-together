import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { Component, ReactNode } from "react";

interface ICommandBarProps {
    width: number;
}

class CommandBar extends Component<ICommandBarProps> {
    
    render(): ReactNode {
        return <Theme 
            className="command-bar"
            backgroundLevel={BackgroundLevel.Level2}
            style={{ width: this.props.width }}
        >
        </Theme>    
    }
}

export { CommandBar };