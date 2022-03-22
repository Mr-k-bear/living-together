import { Component, ReactNode } from "react";
import { IMixinStatusProps, useStatusWithEvent } from "@Context/Status";
import { BackgroundLevel, Theme } from "@Component/Theme/Theme";
import { Popup as PopupModel } from "@Context/Popups";
import "./Popup.scss";

interface IPopupProps {}

@useStatusWithEvent("popupChange")
class Popup extends Component<IPopupProps & IMixinStatusProps> {

    public renderMask(index?: number, click?: () => void, key?: string): ReactNode {
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

    public renderRootMask(): ReactNode {
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

    public renderMaskList(): ReactNode {
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

    public renderLayer(popup: PopupModel) {
        const pageWidth = document.documentElement.clientWidth;
        const pageHeight = document.documentElement.clientHeight;
        const top = (pageHeight - popup.height) / 2;
        const left = (pageWidth - popup.width) / 2;

        return <Theme
            style={{
                width: popup.width,
                height: popup.height,
                zIndex: popup.zIndex(),
                top: top,
                left: left
            }}
            key={popup.id}
            backgroundLevel={BackgroundLevel.Level4}
            className="popup-layer show-scale"
        >
            <div className="popup-layer-header">
                
            </div>
        </Theme>
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