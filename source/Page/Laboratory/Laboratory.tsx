import { Component, ReactNode, StrictMode } from "react";
import { Group } from "@Model/Group";
import { Entry } from "../Entry/Entry";
import "./Laboratory.scss";

class Test extends Component {
    render(): ReactNode {
        return <div className="main">
            <div className="a">it work</div>
            <div>ok</div>
        </div>
    }
}

Entry.renderComponent(Test);

console.log(new Group);