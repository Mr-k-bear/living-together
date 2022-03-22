import { ReactNode } from "react";
import { Emitter } from "@Model/Emitter";

type IPopupConstructor = new (controller: PopupController, id: string) => Popup;

/**
 * 弹窗类型
 */
class Popup {

    /**
     * 是否关闭
     */
    public isClose: boolean = false;

    /**
     * 唯一标识符
     */
    public id: string;

    /**
     * 控制器
     */
    public controller: PopupController;

    /**
     * 渲染层级
     */
    public index: number = Infinity;

    /**
     * react 节点
     */
    public reactNode: ReactNode;

    /**
     * 渲染函数
     */
    public onRender(p: Popup): ReactNode {
        return null;
    }

    /**
     * 关闭回调
     */
    public onClose(): void {};

    /**
     * 渲染节点
     */
    public render(): ReactNode {
        this.reactNode = this.onRender(this);
        return this.reactNode;
    };

    public close() {
        return this.controller.closePopup(this);
    }

    public constructor(controller: PopupController, id: string) {
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
     * 弹窗列表
     */
    public popups: Popup[] = [];

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
    public showPopup<P extends IPopupConstructor>(popup?: P): Popup {
        let newPopup = new (popup ?? Popup)(this, `P-${this.idIndex ++}`);
        this.popups.push(newPopup);
        this.sortPopup();
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
                    currentPopup.onClose();
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

export { Popup, PopupController }