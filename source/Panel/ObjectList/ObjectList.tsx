import { Component, ReactNode } from "react";
import { DetailsList } from "@Component/DetailsList/DetailsList";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { Localization } from "@Component/Localization/Localization";

@useStatus
class ObjectList extends Component<IMixinStatusProps> {

    private handelChange = () => {
        this.forceUpdate();
    }

    public componentDidMount(){
        if (this.props.status) {
            this.props.status.model.on("objectChange", this.handelChange);
        }
    }

    public componentWillUnmount(){
        if (this.props.status) {
            this.props.status.model.off("objectChange", this.handelChange);
        }
    }

    private renderList() {
        const objList = this.props.status?.model.objectPool ?? [];

        if (objList.length <= 0) {
            return <Localization i18nKey="Object.List.No.Data" style={{
                padding: "10px",
                display: "block"
            }}/>
        }

        return <DetailsList
            items={objList.concat([]).map((object => {
                return {
                    key: object.id.toString(),
                    name: object.displayName,
                    color: object.color,
                    display: object.display,
                    update: object.update
                }
            }))}
            columns={[
                {
                    key: "name",
                    render: (name) => <span>{name}</span>
                // }, {
                //     key: "behaviors",
                //     render: (behaviors) => <span>{(behaviors as Record<"name", string>[]).map(r => r.name).join(", ")}</span>
                // }, {
                //     key: "label",
                //     render: (label) => <span>{(label as Record<"name", string>[]).map(r => r.name).join(", ")}</span>
                }
            ]}
        />
    }

    public render(): ReactNode {
        return this.renderList();
    }
}

export { ObjectList };