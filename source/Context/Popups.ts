import { ReactNode } from "react";

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
    public index: number = 0;

    /**
     * react 节点
     */
    public reactNode: ReactNode;

    /**
     * 渲染函数
     */
    public rendererFunction: undefined | ((p: Popup) => ReactNode);

    /**
     * 渲染节点
     */
    public render(): ReactNode {
        if (this.rendererFunction) {
            this.reactNode = this.rendererFunction(this);
        }
        return this.reactNode;
    };

    public constructor(controller: PopupController, id: string) {
        this.controller = controller;
        this.id = id;
    }
}

/**
 * 弹窗模型
 */
class PopupController {

    /**
     * ID 序列号
     */
    private idIndex = 0;

    /**
     * 弹窗列表
     */
    public popups: Popup[] = [];

    public sortPopup() {
        this.popups = this.popups.sort((a, b) => a.index - b.index);
    }

    public newPopup(): Popup {
        let newPopup = new Popup(this, `P-${this.idIndex ++}`);
        this.popups.push(newPopup);
        return newPopup;
    }

    public closePopup(popup: Popup | string) {

    }

}

export { Popup, PopupController }