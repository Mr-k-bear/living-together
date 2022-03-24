import { Component, ReactNode } from "react";
import { IMixinStatusProps, useStatusWithEvent } from "@Context/Status";
import { IMixinSettingProps, useSettingWithEvent } from "@Context/Setting";
import { BackgroundLevel, FontLevel, getClassList, Theme } from "@Component/Theme/Theme";
import { Popup as PopupModel, ResizeDragDirection } from "@Context/Popups";
import { Icon } from "@fluentui/react";
import "./Popup.scss";

interface IPopupProps {}

@useSettingWithEvent("themes")
@useStatusWithEvent("popupChange")
class Popup extends Component<IPopupProps & IMixinStatusProps & IMixinSettingProps> {

    private renderMask(index?: number, click?: () => void, key?: string): ReactNode {
        const classList: string[] = ["popup-mask", "show-fade", 
            ...getClassList({}, this.props.setting)
        ];
        return <div
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
        return <div
            className={getClassList({
                className: "popup-layer-header",
                backgroundLevel: BackgroundLevel.Level3,
                fontLevel: FontLevel.Level3
            }, this.props.setting).join(" ")}
        >
            <div
                className="header-text"
                onMouseDown={(e) => {
                    popup.isOnMouseDown = true;
                    popup.lastMouseLeft = e.clientX;
                    popup.lastMouseTop = e.clientY;
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
        return <div
            className={getClassList({
                className: "popup-layer-content",
                backgroundLevel: BackgroundLevel.Level4,
                fontLevel: FontLevel.normal
            }, this.props.setting).join(" ")}
        >
            {popup.render()}
        </div>
    }

    private renderDragBlock(dir: ResizeDragDirection, popup: PopupModel) {
        return <div className="render-drag-block-root">
            <div
                draggable={false}
                style={{
                    cursor: this.mapDirToCursor.get(dir),
                    zIndex: popup.zIndex() + 2
                }}
                className="render-drag-block"
                onMouseDown={(e) => {
                    popup.lastMouseLeft = e.clientX;
                    popup.lastMouseTop = e.clientY;
                    popup.resizeDragDirection = dir;
                    popup.isResizeMouseDown = true;
                }}
                onMouseEnter={() => {
                    popup.resizeHoverDirection = dir;
                    this.forceUpdate();
                }}
                onMouseLeave={() => {
                    popup.resizeHoverDirection = undefined;
                    this.forceUpdate();
                }}
            />
        </div>
    }

    private mapDirToCursor = new Map<ResizeDragDirection, string>([
        [ResizeDragDirection.rightTop, "sw-resize"],
        [ResizeDragDirection.rightBottom, "nw-resize"],
        [ResizeDragDirection.leftBottom, "sw-resize"],
        [ResizeDragDirection.LeftTop, "nw-resize"]
    ]);

    private renderDragLine(dir: ResizeDragDirection, popup: PopupModel) {
        let xy: boolean = false;
        const dragLineCList: string[] = ["drag-line"];

        if (dir === ResizeDragDirection.top || dir === ResizeDragDirection.bottom) {
            xy = false;
        }
        if (dir === ResizeDragDirection.left || dir === ResizeDragDirection.right) {
            xy = true;
        }
        if (
            (
                dir === ResizeDragDirection.top && 
                (
                    popup.resizeHoverDirection === ResizeDragDirection.LeftTop ||
                    popup.resizeHoverDirection === ResizeDragDirection.rightTop
                )    
            ) ||
            (
                dir === ResizeDragDirection.bottom && 
                (
                    popup.resizeHoverDirection === ResizeDragDirection.leftBottom ||
                    popup.resizeHoverDirection === ResizeDragDirection.rightBottom
                )    
            ) ||
            (
                dir === ResizeDragDirection.right && 
                (
                    popup.resizeHoverDirection === ResizeDragDirection.rightTop ||
                    popup.resizeHoverDirection === ResizeDragDirection.rightBottom
                )    
            ) ||
            (
                dir === ResizeDragDirection.left && 
                (
                    popup.resizeHoverDirection === ResizeDragDirection.leftBottom ||
                    popup.resizeHoverDirection === ResizeDragDirection.LeftTop
                )    
            )
        ) {
            dragLineCList.push("hover")
        }
        
        return <div
            className={"drag-line-root" + (xy ? " drag-line-y" : "")}
            style={{
                width: xy ? "0" : "100%",
                height: xy ? "100%" : "0",
                zIndex: popup.zIndex() + 1
            }}
        >
            {
                xy && dir === ResizeDragDirection.left ? this.renderDragBlock(
                    ResizeDragDirection.LeftTop, popup
                ) : null
            }
            {
                xy && dir === ResizeDragDirection.right ? this.renderDragBlock(
                    ResizeDragDirection.rightTop, popup
                ) : null
            }
            {
                !xy && dir === ResizeDragDirection.bottom ? this.renderDragBlock(
                    ResizeDragDirection.leftBottom, popup
                ) : null
            }
            <div
                draggable={false}
                className={dragLineCList.join(" ")}
                style={{
                    cursor: xy ? "e-resize" : "n-resize",
                    minWidth: xy ? "4px" : "calc( 100% + 2px )",
                    minHeight: xy ? "calc( 100% + 2px )" : "4px"
                }}
                onMouseDown={(e) => {
                    popup.lastMouseLeft = e.clientX;
                    popup.lastMouseTop = e.clientY;
                    popup.resizeDragDirection = dir;
                    popup.isResizeMouseDown = true;
                }}
            />
            {
                !xy && dir === ResizeDragDirection.bottom ? this.renderDragBlock(
                    ResizeDragDirection.rightBottom, popup
                ) : null
            }
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
            key={popup.id}
            style={{
                width: popup.width,
                height: popup.height,
                zIndex: popup.zIndex(),
                top: popup.top,
                left: popup.left
            }}
            className={getClassList({
                className: "popup-layer show-scale",
                backgroundLevel: BackgroundLevel.Level4,
            }, this.props.setting).join(" ")}
        >
            {this.renderDragLine(ResizeDragDirection.top, popup)}
            <div className="popup-layer-container">
                {this.renderDragLine(ResizeDragDirection.left, popup)}
                <div className="popup-layer-root-content">
                    {this.renderHeader(popup)}
                    {this.renderContent(popup)}
                </div>
                {this.renderDragLine(ResizeDragDirection.right, popup)}
            </div>
            {this.renderDragLine(ResizeDragDirection.bottom, popup)}
        </Theme>
    }

    private isMouseDown: boolean = false;

    private handelMouseDown = () => {
        this.isMouseDown = true;
    }

    private handelMouseUp = () => {
        this.isMouseDown = false;
        if (this.props.status) {
            this.props.status.popup.popups.forEach((popup) => {
                popup.isOnMouseDown = false;
                popup.resizeDragDirection = undefined;
                popup.isResizeMouseDown = false;
            });
        }
    }

    private resize(popup: PopupModel, dis: number, dir: boolean, lsk: boolean) {
        
        if (dir) {
            // Y
            popup.isResizeOverFlowY = false;
            const heightBackup = popup.height
            const topBackup = popup.top;
            if (lsk) {
                popup.height += dis;
            } else {
                popup.top += dis;
                popup.height -= dis;
            }
            if (popup.height < popup.minHeight) {
                popup.height = heightBackup;
                popup.top = topBackup;
                popup.isResizeOverFlowY = true;
            }
        } else {
            // X
            popup.isResizeOverFlowX = false;
            const leftBackup = popup.left
            const widthBackup = popup.width;
            if (lsk) {
                popup.width += dis;
            } else {
                popup.left += dis;
                popup.width -= dis;
            }
            if (popup.width < popup.minWidth) {
                popup.width = widthBackup;
                popup.left = leftBackup;
                popup.isResizeOverFlowX = true;
            }
        }
    }

    private handelMouseMove = (e: MouseEvent) => {
        let isActionSuccess: boolean = false;
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
                    isActionSuccess = true;
                    this.forceUpdate();
                }
            });
        }
        if (this.props.status) {
            this.props.status.popup.popups.forEach((popup) => {
                if (popup.resizeDragDirection) {
                        
                    let moveX = e.clientX - popup.lastMouseLeft;
                    let moveY = e.clientY - popup.lastMouseTop;
                    switch (popup.resizeDragDirection) {

                        case ResizeDragDirection.LeftTop:
                            this.resize(popup, moveX, false, false);
                            this.resize(popup, moveY, true, false);
                            break;

                        case ResizeDragDirection.leftBottom:
                            this.resize(popup, moveX, false, false);
                            this.resize(popup, moveY, true, true);
                            break;

                        case ResizeDragDirection.rightTop:
                            this.resize(popup, moveX, false, true);
                            this.resize(popup, moveY, true, false);
                            break;

                        case ResizeDragDirection.rightBottom:
                            this.resize(popup, moveX, false, true);
                            this.resize(popup, moveY, true, true);
                            break;

                        case ResizeDragDirection.top:
                            this.resize(popup, moveY, true, false);
                            break;

                        case ResizeDragDirection.left:
                            this.resize(popup, moveX, false, false);
                            break;

                        case ResizeDragDirection.bottom:
                            this.resize(popup, moveY, true, true);
                            break;

                        case ResizeDragDirection.right:
                            this.resize(popup, moveX, false, true);
                            break;
                    }
                    if (!popup.isResizeOverFlowX) {
                        popup.lastMouseLeft = e.clientX;
                    }
                    if (!popup.isResizeOverFlowY) {
                        popup.lastMouseTop = e.clientY;
                    }
                    isActionSuccess = true;
                    this.forceUpdate();
                }
            });
        }
        if (isActionSuccess) {
            e.preventDefault();
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