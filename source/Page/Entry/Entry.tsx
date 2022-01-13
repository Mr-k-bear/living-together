import { Component, ReactNode, StrictMode } from "react";
import { render } from "react-dom";

class Entry extends Component<{}, {}> {

    render(): ReactNode {
        return (
            <StrictMode>
                {this.props.children}
            </StrictMode>
        );
    }

    /**
     * 渲染组件
     * @param component 需要渲染的组件
     */
    public static renderComponent(component: new () => Component) {
    }
}