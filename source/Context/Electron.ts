import { createContext } from "react";
import { superConnect, superConnectWithEvent } from "@Context/Context";
import { ISimulatorAPI, IApiEmitterEvent } from "@Electron/SimulatorAPI";

interface IMixinElectronProps {
    electron?: ISimulatorAPI;
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

export { useElectron, ElectronProvider, IMixinElectronProps, ISimulatorAPI, useElectronWithEvent };