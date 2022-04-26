import { Emitter } from "@Model/Emitter";

type IApiEmitterEvent = {
	windowsSizeStateChange: void;
	fileSave: {success: boolean, name: string, url: string};
}

interface ISimulatorAPI extends Emitter<IApiEmitterEvent> {

	/**
	 * 关闭窗口
	 */
	close: () => void;

	/**
	 * 最大化窗口
	 */
	maximize: () => void;

	/**
	 * 取消最大化
	 */
	unMaximize: () => void;

	/**
	 * 是否处于最大化状态
	 */
	isMaximized: () => boolean;

	/**
	 * 是否处于最大化状态
	 */
	minimize: () => void;

	/**
	 * 存档
	 */
	fileSave: (text: string, name: string, title: string, button: string, url?: string) => void;
}

export { ISimulatorAPI, IApiEmitterEvent }