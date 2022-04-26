import { createContext } from "react";
import { Emitter } from "@Model/Emitter";
import { superConnect, superConnectWithEvent } from "@Context/Context";
import { ISimulatorAPI, IApiEmitterEvent } from "@Electron/SimulatorAPI";

interface IMixinElectronProps {
    electron?: ISimulatorAPI;
}

const getElectronAPI: () => ISimulatorAPI = () => {
    const API = (window as any).API;
    const mapperEmitter = new Emitter();
    const ClassElectron: new () => ISimulatorAPI = function (this: Record<string, any>) {
        this.resetAll = () => mapperEmitter.resetAll();
        this.reset = (type: string) => mapperEmitter.reset(type);
        this.on = (type: string, handel: any) => mapperEmitter.on(type, handel);
        this.off = (type: string, handel: any) => mapperEmitter.off(type, handel);
        this.emit = (type: string, data: any) => mapperEmitter.emit(type, data);
    } as any;
    ClassElectron.prototype = API;

    // Emitter Mapper
    API.mapEmit((...p: any) => {
        mapperEmitter.emit(...p);
    });
    return new ClassElectron();
}

const ElectronContext = createContext<ISimulatorAPI>((window as any).API ?? {} as ISimulatorAPI);

ElectronContext.displayName = "Electron";
const ElectronProvider = ElectronContext.Provider;
const ElectronConsumer = ElectronContext.Consumer;

/**
 * 修饰器
 */
const useElectron = superConnect<ISimulatorAPI>(ElectronConsumer, "electron");

const useElectronWithEvent = superConnectWithEvent<ISimulatorAPI, IApiEmitterEvent>(ElectronConsumer, "electron");

export { useElectron, ElectronProvider, IMixinElectronProps, ISimulatorAPI, useElectronWithEvent, getElectronAPI };