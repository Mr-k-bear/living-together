import { createContext, Component, FunctionComponent } from "react";
import { Emitter } from "@Model/Emitter";
import { Model } from "@Model/Model";
import { Archive } from "@Model/Archive";
import { AbstractRenderer } from "@Model/Renderer";
import { ClassicRenderer, MouseMod } from "@GLRender/ClassicRenderer";
import { Setting } from "./Setting";
import { I18N } from "@Component/Localization/Localization";

function randomColor() {
    return [Math.random(), Math.random(), Math.random(), 1]
}

class Status extends Emitter<{
    mouseModChange: MouseMod
}> {

    public setting: Setting = undefined as any;

    /**
     * 对象命名
     */
    public objectNameIndex = 1;

    /**
     * 渲染器
     */
    public renderer: AbstractRenderer = undefined as any;

    /**
     * 文件状态
     */
    public archive: Archive = new Archive();

    /**
     * 模型状态
     */
    public model: Model = new Model();

    /**
     * 鼠标工具状态
     */
    public mouseMod: MouseMod = MouseMod.Drag;

    public newGroup() {
        const group = this.model.addGroup();
        group.color = randomColor();
        group.displayName = I18N(this.setting.language, "Object.List.New.Group", {
            id: this.objectNameIndex.toString()
        });
        this.objectNameIndex ++;
        return group;
    }

    public newRange() {
        const range = this.model.addRange();
        range.color = randomColor();
        range.displayName = I18N(this.setting.language, "Object.List.New.Range", {
            id: this.objectNameIndex.toString()
        });
        this.objectNameIndex ++;
        return range;
    }

    public setMouseMod(mod: MouseMod) {
        this.mouseMod = mod;
        if (this.renderer instanceof ClassicRenderer) {
            this.renderer.mouseMod = mod;
            this.renderer.setMouseIcon();
        }
        this.emit("mouseModChange", mod);
    }

}

interface IMixinStatusProps {
    status?: Status;
}

const StatusContext = createContext<Status>(new Status());

StatusContext.displayName = "Status";
const StatusProvider = StatusContext.Provider;
const StatusConsumer = StatusContext.Consumer;

type RenderComponent = (new (...p: any) => Component<any, any, any>) | FunctionComponent<any>;

/**
 * 修饰器
 */
function useStatus<R extends RenderComponent>(components: R): R {
    return ((props: any) => {
        const C = components;
        return <StatusConsumer>
            {(status: Status) => <C {...props} status={status}></C>}
        </StatusConsumer>
    }) as any;
}

export {
    Status, StatusContext, useStatus,
    IMixinStatusProps, StatusProvider, StatusConsumer
};