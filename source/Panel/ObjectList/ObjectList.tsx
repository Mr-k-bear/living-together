import { Component, ReactNode } from "react";
import { DetailsList } from "@Component/DetailsList/DetailsList";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { Localization } from "@Component/Localization/Localization";
import "./ObjectList.scss";

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
                    key: "color",
                    noDefaultStyle: true,
                    beforeCheckbox: true,
                    render: (color) => <div
                        className="object-list-color-value"
                        style={{
                            background: `rgb(${
                                Math.floor(color[0] * 255)
                            }, ${
                                Math.floor(color[1] * 255)
                            }, ${
                                Math.floor(color[2] * 255)
                            })`
                        }}
                    />
                }, {
                    key: "name",
                    render: (name) => <span>{name}</span>
                }
            ]}
        />
    }

    public render(): ReactNode {
        return this.renderList();
    }
}

export { ObjectList };