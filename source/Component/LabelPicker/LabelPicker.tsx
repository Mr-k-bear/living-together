import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { Label } from "@Model/Label";
import { Component, ReactNode } from "react";
import { LabelList } from "../LabelList/LabelList";
import "./LabelPicker.scss"

interface ILabelPickerProps {
	keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
	labels: Label[];
}

class LabelPicker extends Component<ILabelPickerProps> {

	public render(): ReactNode {
		return <div
			className="label-picker-root"
		>
			<div className="input-intro">
				<Localization i18nKey={this.props.keyI18n}/>
			</div>
			<div className="root-content">
				<LabelList
					labels={this.props.labels}
					minHeight={26}
					deleteLabel={() => {
						
					}}
					addLabel={() => {

					}}
				/>
			</div>
		</div>
	}
}

export { LabelPicker }