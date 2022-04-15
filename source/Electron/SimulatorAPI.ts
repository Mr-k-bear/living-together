
interface ISimulatorAPI {

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
}

export { ISimulatorAPI }