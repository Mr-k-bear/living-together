import { Component, ReactNode } from "react";
import { render } from "react-dom";
import { Group } from "@Model/Group";
import "./Laboratory.scss";

class Test extends Component {
    render(): ReactNode {
        return <div className="main">
            <div className="a">it work</div>
            <div>ok</div>
        </div>
    }
}

render(
    <Test></Test>, 
    document.getElementById("root")
);

console.log(new Group);