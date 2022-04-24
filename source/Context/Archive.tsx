import { FunctionComponent, useEffect } from "react";
import * as download from "downloadjs";
import { useSetting, IMixinSettingProps, Platform } from "@Context/Setting";
import { useStatus, IMixinStatusProps } from "@Context/Status";
import { I18N } from "@Component/Localization/Localization";

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

const ArchiveSaveDownloadView: FunctionComponent<IFileInfo & ICallBackProps> = function ArchiveSave(props) {

	const runner = async () => {
		const file = await props.fileData();
		setTimeout(() => {
			download(file, props.fileName, "text/json");
			props.then();
		}, 100);
	}

	useEffect(() => { runner() }, []);

	return <></>;
}

const ArchiveSaveDownload = ArchiveSaveDownloadView;

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
				<></>
		}
	</>
}

const ArchiveSave = useSetting(useStatus(ArchiveSaveView));

export { ArchiveSave };