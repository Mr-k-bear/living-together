import { Component, ReactNode, StrictMode, FunctionComponent } from "react";
import { render } from "react-dom";
import "./Entry.scss";

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
    public static renderComponent(
        RenderComponent: (new (...p: any) => Component) | FunctionComponent
    ) {
        render(
            <Entry><RenderComponent/></Entry>, 
            document.getElementById("root")
        );
    }
}

export default Entry;
export { Entry };