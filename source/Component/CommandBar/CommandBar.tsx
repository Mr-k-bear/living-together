import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { IconButton } from "@fluentui/react";
import { Component, ReactNode } from "react";
import "./CommandBar.scss";

interface ICommandBarProps {
    width: number;
}

class CommandBar extends Component<ICommandBarProps> {

    render(): ReactNode {
        return <Theme
            className="command-bar"
            backgroundLevel={BackgroundLevel.Level3}
            style={{ width: this.props.width }}
        >
            <div>
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "Save"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "HandsFree"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "TouchPointer"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "Camera"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "Play"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "PlayResume"}}
                    className="command-button"
                />
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "PlayReverseResume"}}
                    className="command-button"
                />
            </div>
            <div>
                <IconButton 
                    style={{ height: this.props.width }}
                    iconProps={{iconName: "Settings"}}
                    className="command-button on-end"
                />
            </div>
        </Theme>
    }
}

export { CommandBar };