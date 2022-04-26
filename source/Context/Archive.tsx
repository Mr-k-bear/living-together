import { FunctionComponent, useEffect } from "react";
import { useSetting, IMixinSettingProps, Platform } from "@Context/Setting";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { useElectron, IMixinElectronProps } from "@Context/Electron";
import { I18N } from "@Component/Localization/Localization";
import * as download from "downloadjs";

interface IFileInfo {
	fileName: string;
	isNewFile: boolean;
	isSaved: boolean;
	fileUrl?: string;
	fileData: () => Promise<string>;
}

interface IRunnerProps {
	running?: boolean;
	afterRunning?: () => any;
}

interface ICallBackProps {
	then: () => any;
}

const ArchiveSaveDownloadView: FunctionComponent<IFileInfo & ICallBackProps> = function ArchiveSaveDownloadView(props) {

	const runner = async () => {
		const file = await props.fileData();
		setTimeout(() => {
			download(file, props.fileName, "text/json");
			props.then();
		}, 10);
	}

	useEffect(() => { runner() }, []);

	return <></>;
}

const ArchiveSaveDownload = ArchiveSaveDownloadView;

const ArchiveSaveFsView: FunctionComponent<IFileInfo & ICallBackProps & IMixinElectronProps & IMixinSettingProps & IMixinStatusProps> =
function ArchiveSaveFsView(props) {

	const runner = async () => {
		const file = await props.fileData();
		if (props.electron) {
			props.electron.fileSave(
				file,
				I18N(props, "Popup.Load.Save.Select.File.Name"),
				I18N(props, "Popup.Load.Save.Select.Path.Title"),
				I18N(props, "Popup.Load.Save.Select.Path.Button"),
				props.fileUrl
			);
		}
	}

	const saveEvent = ({name, url, success} : {name: string, url: string, success: boolean}) => {
		if (success && props.status) {
			props.status.archive.fileUrl = url;
			props.status.archive.fileName = name;
			props.status.archive.isNewFile = false;
			props.status.archive.emit("fileSave", props.status.archive);
		}
		props.then();
	}

	useEffect(() => {
		runner();
		props.electron?.on("fileSave", saveEvent);
		return () => {
			props.electron?.off("fileSave", saveEvent);
		};
	}, []);

	return <></>;
}

const ArchiveSaveFs = useSetting(useElectron(useStatus(ArchiveSaveFsView)));

/**
 * 保存存档文件
 */
const ArchiveSaveView: FunctionComponent<IMixinSettingProps & IMixinStatusProps & IRunnerProps> = function ArchiveSave(props) {

	if (!props.running) {
		return <></>;
	}

	const fileData: IFileInfo = {
		fileName: "",
		isNewFile: true,
		isSaved: false,
		fileUrl: undefined,
		fileData: async () => `{"nextIndividualId":0,"objectPool":[],"labelPool":[],"behaviorPool":[]}`
	}

	if (props.status) {
		fileData.isNewFile = props.status.archive.isNewFile;
		fileData.fileName = props.status.archive.fileName ?? "";
		fileData.isSaved = props.status.archive.isSaved;
		fileData.fileUrl = props.status.archive.fileUrl;
	}

	if (fileData.isNewFile) {
		fileData.fileName = I18N(props, "Header.Bar.New.File.Name");
	}

	// 生成存档文件
	fileData.fileData = async () => {
		return props.status?.archive.save(props.status.model) ?? "";
	};

	const callBack = () => {
		if (props.afterRunning) {
			props.afterRunning();
		}
	}
	
	return <>
		{
			props.setting?.platform === Platform.web ? 
				<ArchiveSaveDownload {...fileData} then={callBack}/> :
				<ArchiveSaveFs {...fileData} then={callBack}/>
		}
	</>
}

const ArchiveSave = useSetting(useStatus(ArchiveSaveView));

export { ArchiveSave };