import { Component, ReactNode } from "react";
import { DetailsList } from "@Component/DetailsList/DetailsList";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { Localization } from "@Component/Localization/Localization";
import { ObjectID } from "@Model/Renderer";
import "./ObjectList.scss";

@useStatus
class ObjectList extends Component<IMixinStatusProps> {

    private handelChange = () => {
        this.forceUpdate();
    }

    public componentDidMount(){
        if (this.props.status) {
            this.props.status.model.on("objectChange", this.handelChange);
            this.props.status.on("focusObjectChange", this.handelChange);
        }
    }

    public componentWillUnmount(){
        if (this.props.status) {
            this.props.status.model.off("objectChange", this.handelChange);
            this.props.status.off("focusObjectChange", this.handelChange);
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
            className="object-list"
            items={objList.concat([]).map((object => {
                return {
                    key: object.id.toString(),
                    name: object.displayName,
                    color: object.color,
                    display: object.display,
                    update: object.update,
                    select: this.props.status ? 
                        this.props.status.focusObject.has(object.id.toString()) || 
                        this.props.status.focusObject.has(object.id) :
                        false
                }
            }))}
            clickLine={(item) => {
                if (this.props.status) {
                    this.props.status.setFocusObject(new Set<ObjectID>().add(item.key));
                }
            }}
            checkBox={(item) => {
                if (this.props.status) {
                    if (
                        this.props.status.focusObject.has(item.key.toString()) ||
                        this.props.status.focusObject.has(item.key)
                    ) {
                        this.props.status.focusObject.delete(item.key);
                        this.props.status.focusObject.delete(item.key.toString());
                        this.props.status.setFocusObject(this.props.status.focusObject);
                    } else {
                        this.props.status.setFocusObject(this.props.status.focusObject.add(item.key));
                    }
                }
            }}
            click={() => {
                if (this.props.status) {
                    this.props.status.setFocusObject(new Set<ObjectID>());
                }
            }}
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