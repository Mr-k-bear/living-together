import { createContext, Component, FunctionComponent } from "react";
import { Emitter } from "@Model/Emitter";
import { Model } from "@Model/Model";
import { Archive } from "@Model/Archive";
import { AbstractRenderer } from "@Model/Renderer";

class Status extends Emitter<{}> {

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