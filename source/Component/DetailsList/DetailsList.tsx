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
    renderCheckbox?: (data: IItems, click: () => void) => ReactNode;
}

class DetailsList extends Component<IDetailsListProps> {

    private propagationCount = 0;

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

    private handelClickCheckbox(item: IItems) {
        if (this.propagationCount <= 2 && this.props.checkBox) {
            this.props.checkBox(item);
            this.propagationCount = 2;
        }
    }

    private renderCheckbox(item: IItems) {
        const { checkboxClassName } = this.props;
        return <div 
            className={"details-list-checkbox" + (checkboxClassName ? ` ${checkboxClassName}` : "")}
            onClick={() => this.handelClickCheckbox(item)}
        >
            <Icon iconName="CheckMark"></Icon>
        </div>;
    }

    public render(): ReactNode {
        return <Theme
            className={"details-list" + (this.props.className ? ` ${this.props.className}` : "")}
            onClick={() => {
                if (this.propagationCount <= 0 && this.props.click) {
                    this.props.click();
                }
                this.propagationCount = 0;
            }}
            backgroundLevel={BackgroundLevel.Level4}
            fontLevel={FontLevel.normal}
        >{
            this.props.items.map((item) => {
                const classList: string[] = ["details-list-item"];
                if (item.select) {
                    classList.push("active");
                }
                return <div
                    className={classList.join(" ")}
                    key={item.key}
                    onClick={() => {
                        if (this.propagationCount <= 1 && this.props.clickLine) {
                            this.props.clickLine(item);
                            this.propagationCount = 1;
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
                            this.props.renderCheckbox ? 
                                this.props.renderCheckbox(item, () => this.handelClickCheckbox(item)) :
                                this.renderCheckbox(item)
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