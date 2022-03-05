import { Icon } from "@fluentui/react";
import { Component, ReactNode } from "react";
import { BackgroundLevel, FontLevel, Theme } from "../Theme/Theme";
import "./DetailsList.scss";

type IItems = Record<string, any> & {key: string, select?: boolean};

interface IColumns<D extends IItems, K extends keyof D> {
    key: K;
    className?: string;
    noDefaultStyle?: boolean;
    beforeCheckbox?: boolean;
    render: (data: D[K]) => ReactNode,
    click?: (data: D[K]) => any,
}

interface IDetailsListProps {
    items: IItems[];
    className?: string;
    columns: IColumns<this["items"][number], keyof this["items"][number]>[];
    hideCheckBox?: boolean;
    checkboxClassName?: string;
    click?: () => void;
    clickLine?: (item: IItems) => any;
    checkBox?: (data: IItems) => any;
}

class DetailsList extends Component<IDetailsListProps> {

    private renderValue<D extends IItems, K extends keyof D>(item: IItems, column: IColumns<D, K>) {
        const classList: string[] = [];
        if (!column.noDefaultStyle) {
            classList.push("details-list-value");
        }
        if (column.className) {
            classList.push(column.className);
        }
        return <div
            className={classList.join(" ")}
            key={column.key as any}
        >
            {column.render(item[column.key as any])}
        </div>
    }

    public render(): ReactNode {
        return <Theme
            className={"details-list" + (this.props.className ? ` ${this.props.className}` : "")}
            onClick={this.props.click}
            backgroundLevel={BackgroundLevel.Level4}
            fontLevel={FontLevel.normal}
        >{
            this.props.items.map((item) => {
                const { checkboxClassName } = this.props;
                const classList: string[] = ["details-list-item"];
                if (item.select) {
                    classList.push("active");
                }
                return <div
                    className={classList.join(" ")}
                    key={item.key}
                    onClick={(e) => {
                        if (this.props.clickLine) {
                            e.stopPropagation();
                            this.props.clickLine(item);
                        }
                    }}
                >
                    {
                        this.props.columns.map((column) => {
                            if (column.beforeCheckbox) {
                                return this.renderValue(item, column);
                            }
                        })
                    }
                    {
                        this.props.hideCheckBox ? null :
                        <div 
                            className={"details-list-checkbox" + (checkboxClassName ? ` ${checkboxClassName}` : "")}
                            onClick={(e) => {
                                if (this.props.checkBox) {
                                    e.stopPropagation();
                                    this.props.checkBox(item);
                                }
                            }}
                        >
                            <Icon iconName="CheckMark"></Icon>
                        </div>
                    }
                    {
                        this.props.columns.map((column) => {
                            if (!column.beforeCheckbox) {
                                return this.renderValue(item, column);
                            }
                        })
                    }
                </div>
            })
        }</Theme>
    }
}

export { DetailsList, IItems };