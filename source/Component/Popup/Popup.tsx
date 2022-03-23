import { Component, ReactNode } from "react";
import { IMixinStatusProps, useStatusWithEvent } from "@Context/Status";
import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { Popup as PopupModel } from "@Context/Popups";
import { Icon } from "@fluentui/react";
import "./Popup.scss";

interface IPopupProps {}

@useStatusWithEvent("popupChange")
class Popup extends Component<IPopupProps & IMixinStatusProps> {

    private renderMask(index?: number, click?: () => void, key?: string): ReactNode {
        const classList: string[] = ["popup-mask", "show-fade"];
        return <Theme
            key={key}
            onClick={click}
            className={classList.join(" ")}
            style={{
                zIndex: index,
            }}
        />
    }

    private renderRootMask(): ReactNode {
        if (this.props.status) {
            const needMask = this.props.status.popup.popups.some(popup => popup.needMask);
            if (!needMask) return null;
            return this.renderMask(this.props.status.popup.zIndex,
                () => {
                    this.props.status?.popup.popups.forEach(
                        popup => popup.onClose()
                    )
                }
            );
        } else {
            return null;
        }
    }

    private renderMaskList(): ReactNode {
        if (this.props.status) {
            return this.props.status.popup.popups
            .filter((popup) => {
                return popup.needMask && popup.maskForSelf;
            })
            .filter((_, index) => {
                if (index === 0) return false;
                return true;
            })
            .map((popup) => {
                return this.renderMask(popup.zIndex() - 1,
                    () => {
                        popup.onClose();
                    }, popup.id
                );
            })
        } else {
            return null;
        }
    }

    private renderHeader(popup: PopupModel): ReactNode {
        return <div className="popup-layer-header">
            <div
                className="header-text"
                onMouseDown={(e) => {
                    popup.isOnMouseDown = true;
                    popup.lastMouseLeft = e.clientX;
                    popup.lastMouseTop = e.clientY;
                }}
                onMouseUp={() => {
                    popup.isOnMouseDown = false;
                }}
            >
                {popup.onRenderHeader()}
            </div>
            <div
                className="header-close-icon"
                onClick={() => {
                    popup.onClose();
                }}
            >
                <Icon iconName="CalculatorMultiply"/>
            </div>
        </div>
    }

    private renderContent(popup: PopupModel) {
        return <div className="popup-layer-content">
            {popup.render()}
        </div>
    }

    private renderLayer(popup: PopupModel) {
        const pageWidth = document.documentElement.clientWidth;
        const pageHeight = document.documentElement.clientHeight;
        if (isNaN(popup.top)) {
            popup.top = (pageHeight - popup.height) / 2;
        }
        if (isNaN(popup.left)) {
            popup.left = (pageWidth - popup.width) / 2;
        }

        return <Theme
            style={{
                width: popup.width,
                height: popup.height,
                zIndex: popup.zIndex(),
                top: popup.top,
                left: popup.left
            }}
            key={popup.id}
            backgroundLevel={BackgroundLevel.Level4}
            className="popup-layer show-scale"
        >
            {this.renderHeader(popup)}
            {this.renderContent(popup)}
        </Theme>
    }

    private isMouseDown: boolean = false;

    private handelMouseDown = () => {
        this.isMouseDown = true;
    }

    private handelMouseUp = () => {
        this.isMouseDown = false;
    }

    private handelMouseMove = (e: MouseEvent) => {
        if (
            this.isMouseDown &&
            this.props.status &&
            this.props.status.popup.popups.some(popup => popup.isOnMouseDown)
        ) {
            this.props.status.popup.popups.forEach((popup) => {
                if (popup.isOnMouseDown) {
                    popup.top += e.clientY - popup.lastMouseTop;
                    popup.left += e.clientX - popup.lastMouseLeft;
                    popup.lastMouseLeft = e.clientX;
                    popup.lastMouseTop = e.clientY;
                    this.forceUpdate();
                }
            });
        }
    }

    public componentDidMount() {
        window.addEventListener("mousemove", this.handelMouseMove);
        window.addEventListener("mousedown", this.handelMouseDown);
        window.addEventListener("mouseup", this.handelMouseUp);
    }

    public componentWillUnmount() {
        window.removeEventListener("mousemove", this.handelMouseMove);
        window.removeEventListener("mousedown", this.handelMouseDown);
        window.removeEventListener("mouseup", this.handelMouseUp);
    }

    public render(): ReactNode {
        return <>
            {this.renderRootMask()}
            {this.renderMaskList()}
            {this.props.status?.popup.popups.map((popup) => {
                return this.renderLayer(popup);
            })}
        </>;
    }
}

export { Popup };