import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSetting, IMixinSettingProps } from "@Context/Setting";
import { Localization } from "@Component/Localization/Localization";
import { DetailsList } from "@Component/DetailsList/DetailsList";
import { ObjectID } from "@Model/Model";
import { Group } from "@Model/Group";
import { Range } from "@Model/Range";
import { Icon } from "@fluentui/react";
import "./ObjectList.scss";

@useSetting
@useStatusWithEvent("objectChange", "focusObjectChange", "rangeAttrChange", "groupAttrChange")
class ObjectList extends Component<IMixinStatusProps & IMixinSettingProps> {

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

                let objectType = "";
                if (object instanceof Group) {
                    objectType = "G";
                } else if (object instanceof Range) {
                    objectType = "R";
                }

                return {
                    key: object.id.toString(),
                    name: object.displayName,
                    color: object.color,
                    display: object.display,
                    update: object.update,
                    type: objectType,
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
                if (this.props.setting) {
                    if (item.type === "R") {
                        this.props.setting.layout.focus("RangeDetails");
                    }
                    else if (item.type === "G") {
                        this.props.setting.layout.focus("GroupDetails");
                    }
                    this.props.setting.layout.focus("ObjectList");
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
            renderCheckbox={(item, click) => {
                let icon = "CheckMark";
                if (item.type === "R") {
                    icon = "CubeShape";
                }
                else if (item.type === "G") {
                    icon = "WebAppBuilderFragment";
                }
                return <div
                    className="object-list-checkbox details-list-checkbox"
                    onClick={click}
                >
                    <Icon className="checkbox-icon" iconName="CheckMark"></Icon>
                    <Icon className="type-icon" iconName={icon}></Icon>
                </div>;
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