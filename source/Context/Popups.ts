import { ReactNode, createElement } from "react";
import { Emitter } from "@Model/Emitter";
import { Localization } from "@Component/Localization/Localization";
import { IAnyObject } from "@Model/Renderer";

enum ResizeDragDirection {
    top = 1,
    rightTop = 2,
    right = 3,
    rightBottom = 4,
    bottom = 5,
    leftBottom = 6,
    left = 7,
    LeftTop = 8
}

/**
 * 弹窗类型
 */
class Popup<P extends IAnyObject = IAnyObject> {

    public props: P;

    public constructor(props: P) {
        this.props = props;
    }

    public zIndex() {
        return this.index * 5 + this.controller.zIndex;
    }

    public width: number = 300;
    public height: number = 200;
    public minWidth: number = 300;
    public minHeight: number = 200;
    public top: number = NaN;
    public left: number = NaN;
    public lastMouseTop: number = 0;
    public lastMouseLeft: number = 0;
    public isOnMouseDown: boolean = false;
    public resizeHoverDirection?: ResizeDragDirection;
    public resizeDragDirection?: ResizeDragDirection;
    public isResizeMouseDown: boolean = false;
    public isResizeOverFlowX: boolean = false;
    public isResizeOverFlowY: boolean = false;
    public isInit = false;

    /**
     * 是否关闭
     */
    public isClose: boolean = false;

    /**
     * 需要蒙版
     */
    public needMask: boolean = true;

    /**
     * 单独遮挡下层的蒙版
     */
    public maskForSelf: boolean = false;

    /**
     * 唯一标识符
     */
    public id: string = "";

    /**
     * 控制器
     */
    public controller: PopupController = undefined as any;

    /**
     * 渲染层级
     */
    public index: number = Infinity;

    /**
     * 渲染标题
     */
    public onRenderHeader(): ReactNode {
        return createElement(Localization, {i18nKey: "Popup.Title.Unnamed"});
    }

    /**
     * 关闭回调
     */
    public onClose(): void {
        this.close();
    };

    /**
     * 渲染节点
     */
    public render(): ReactNode {
        return null;
    };

    public close(): Popup | undefined {
        return this.controller.closePopup(this);
    }

    public init(controller: PopupController, id: string) {
        this.controller = controller;
        this.id = id;
    }
}

interface IPopupControllerEvent {
    popupChange: void;
}

/**
 * 弹窗模型
 */
class PopupController extends Emitter<IPopupControllerEvent> {

    /**
     * ID 序列号
     */
    private idIndex = 0;

    /**
     * 最小弹窗 Index
     */
    public zIndex = 100;

    /**
     * 弹窗列表
     */
    public popups: Popup[] = [];

    /**
     * 指定弹窗
     */
    public topping(popup: Popup) {
        popup.index = Infinity;
        this.sortPopup();
    }

    /**
     * 排序并重置序号
     */
    public sortPopup() {
        this.popups = this.popups.sort((a, b) => a.index - b.index);
        this.popups = this.popups.map((popup, index) => {
            popup.index = (index + 1);
            return popup;
        });
        this.emit("popupChange");
    }

    /**
     * 实例化并开启一个弹窗
     */
    public showPopup<P extends IAnyObject, T extends Popup<P>>(
        popup: (new (props: P) => T) | Popup<P>, props: P
    ): Popup<P> {
        let newPopup: Popup<P>;
        if (popup instanceof Popup) {
            newPopup = popup;
        } else {
            newPopup = new (popup ?? Popup)(props);
        }
        newPopup.init(this, `P-${this.idIndex ++}`);

        // 延迟渲染防止焦点冲突
        setTimeout(() => {
            this.popups.push(newPopup);
            this.sortPopup();
        });
        return newPopup;
    }

    /**
     * 关闭一个弹窗
     */
    public closePopup(popup: Popup | string): Popup | undefined {
        let id: string;
        if (popup instanceof Popup) {
            id = popup.id;
        } else {
            id = popup;
        }
        let closePopup: Popup | undefined;
        this.popups = this.popups.filter(
            currentPopup => {
                let isDelete = currentPopup.id === id;
                if (isDelete) {
                    closePopup = currentPopup;
                    currentPopup.isClose = true;
                    return false;
                } else {
                    return true;
                }
            }
        );
        if (closePopup) {
            this.sortPopup();
            this.emit("popupChange");
        }
        return closePopup;
    }
}

export { Popup, PopupController, ResizeDragDirection }