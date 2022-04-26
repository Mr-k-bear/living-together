import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { Localization } from "@Component/Localization/Localization";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import { Status, useStatus, IMixinStatusProps } from "@Context/Status";
import { Icon } from "@fluentui/react";
import { FunctionComponent } from "react";
import { useDrop } from 'react-dnd'
import { NativeTypes } from "react-dnd-html5-backend"
import "./LoadFile.scss";

const DragFileMask: FunctionComponent = () => {

	return <Theme
		className="load-file-layer-root"
		fontLevel={FontLevel.normal}
	>
		<div className="load-file-layer">
			<div className="drag-icon">
				<Icon iconName="KnowledgeArticle"/>
			</div>
			<div className="drag-title">
				<Localization i18nKey="Info.Hint.Load.File.Title"/>
			</div>
			<div className="drag-intro">
				<Localization i18nKey="Info.Hint.Load.File.Intro"/>
			</div>
		</div>
	</Theme>; 
}

async function fileChecker(status: Status, file?: File) {

	if (!status) return undefined;

	return new Promise((r, j) => {
		
		// 检查文件存在性
		if (!file) {
			status.popup.showPopup(ConfirmPopup, {
				infoI18n: "Popup.Load.Save.Error.Empty",
				titleI18N: "Popup.Load.Save.Title",
				yesI18n: "Popup.Load.Save.confirm"
			});
			return j();
		}

		// 检测拓展名
		let extendName = (file.name.match(/\.(\w+)$/) ?? [])[1];
		if (extendName !== "ltss") {
			status.popup.showPopup(ConfirmPopup, {
				infoI18n: "Popup.Load.Save.Error.Type",
				infoI18nOption: { ext: extendName },
				titleI18N: "Popup.Load.Save.Title",
				yesI18n: "Popup.Load.Save.confirm"
			});
			return j();
		}

		// 文件读取
		let fileReader = new FileReader();
		fileReader.readAsText(file);
		fileReader.onload = () => {

			const loadFunc = () => {

				// 进行转换
				let errorMessage = status.archive.load(status.model, fileReader.result as string, file.name, file.path);
				if (errorMessage) {
					status.popup.showPopup(ConfirmPopup, {
						infoI18n: "Popup.Load.Save.Error.Parse",
						infoI18nOption: { why: errorMessage },
						titleI18N: "Popup.Load.Save.Title",
						yesI18n: "Popup.Load.Save.confirm"
					});
					j();
				} 

				else {
					r(undefined);
				}
			}

			// 如果保存进行提示
			if (!status.archive.isSaved) {
				status.popup.showPopup(ConfirmPopup, {
					infoI18n: "Popup.Load.Save.Overwrite.Info",
					titleI18N: "Popup.Load.Save.Title",
					yesI18n: "Popup.Load.Save.Overwrite",
					noI18n: "Popup.Action.No",
					red: "yes",
					yes: () => {
						loadFunc();
					},
					no: () => {
						j();
					}
				});
			}

			else {
				loadFunc();
			}			
		}
		fileReader.onerror = () => {
			status.popup.showPopup(ConfirmPopup, {
				infoI18n: "Popup.Load.Save.Error.Parse",
				infoI18nOption: { why: "Unknown error" },
				titleI18N: "Popup.Load.Save.Title",
				yesI18n: "Popup.Load.Save.confirm"
			});
			j();
		}
	});
}

const LoadFileView: FunctionComponent<IMixinStatusProps> = (props) => {

	const [{ isOver }, drop] = useDrop(() => ({
		accept: NativeTypes.FILE,
		drop: (item: { files: File[] }) => {
			if (props.status) {
				fileChecker(props.status, item.files[0]).catch((e) => undefined);
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver()
		})
	}));

	return <>
		{
			isOver ? <DragFileMask/> : null
		}
		<div className="load-file-app-root" ref={drop}>
			{props.children}
		</div>
	</>
}

const LoadFile = useStatus(LoadFileView);

export { LoadFile };