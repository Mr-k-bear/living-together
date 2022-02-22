import { Component, ReactNode, createRef } from "react";
import { Entry } from "../Entry/Entry";
import "./SimulatorWeb.scss";

class SimulatorWeb extends Component {
    
    private canvasContRef = createRef<HTMLDivElement>();

    public render(): ReactNode {
        return <div>Web</div>
    }
}

Entry.renderComponent(SimulatorWeb);