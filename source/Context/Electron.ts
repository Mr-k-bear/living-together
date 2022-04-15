import { createContext } from "react";
import { superConnect } from "@Context/Context";
import { ISimulatorAPI } from "@Electron/SimulatorAPI";

interface IMixinElectronProps {
    electron?: ISimulatorAPI;
}

const ElectronContext = createContext<ISimulatorAPI>({} as ISimulatorAPI);

ElectronContext.displayName = "Electron";
const ElectronProvider = ElectronContext.Provider;
const ElectronConsumer = ElectronContext.Consumer;

/**
 * 修饰器
 */
const useElectron = superConnect<ISimulatorAPI>(ElectronConsumer, "electron");

export { useElectron, ElectronProvider, IMixinElectronProps, ISimulatorAPI };