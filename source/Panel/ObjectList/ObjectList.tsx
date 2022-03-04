import { Component, ReactNode } from "react";
import { DetailsList } from "@Component/DetailsList/DetailsList";

class ObjectList extends Component {
    public render(): ReactNode {
        return <DetailsList
            items={[
                {key: "1", name: "Object 01", behaviors: [{name: "B1"}, {name: "B2"}], label: [{name: "L1"}, {name: "L2"}]},
                {key: "2", name: "New Object", behaviors: [{name: "M1"}], label: [{name: "L1"}]},
                {key: "3", name: "Range 01", behaviors: [], label: []},
                {key: "4", name: "Cube", behaviors: [{name: "AA1"}], label: []},
                {key: "5", name: "Custom Object", behaviors: [{name: "B1"}], label: [{name: "Q1"}, {name: "L2"}]}
            ]}
            columns={[
                {
                    key: "name",
                    render: (name) => <span>{name}</span>
                }, {
                    key: "behaviors",
                    render: (behaviors) => <span>{(behaviors as Record<"name", string>[]).map(r => r.name).join(", ")}</span>
                }, {
                    key: "label",
                    render: (label) => <span>{(label as Record<"name", string>[]).map(r => r.name).join(", ")}</span>
                }
            ]}
        />
    }
}

export { ObjectList };