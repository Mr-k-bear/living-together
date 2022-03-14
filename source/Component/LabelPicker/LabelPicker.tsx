import { AllI18nKeys, Localization } from "@Component/Localization/Localization";
import { PickerList } from "../PickerList/PickerList";
import { Label } from "@Model/Label";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Component, ReactNode, createRef } from "react";
import { LabelList } from "../LabelList/LabelList";
import "./LabelPicker.scss"

interface ILabelPickerProps {
	keyI18n: AllI18nKeys;
    infoI18n?: AllI18nKeys;
	labels: Label[];
	labelAdd?: (label: Label) => any;
	labelDelete?: (label: Label) => any;
}

interface ILabelPickerState {
    isPickerVisible: boolean;
}

@useStatusWithEvent("labelAttrChange", "labelChange")
class LabelPicker extends Component<ILabelPickerProps & IMixinStatusProps, ILabelPickerState> {

	public constructor(props: ILabelPickerProps) {
        super(props);
        this.state = {
            isPickerVisible: false
        }
    }

	private addButtonRef = createRef<HTMLDivElement>();

	private getOtherLabel() {
		let res: Label[] = [];
		let nowLabel: Label[] = this.props.labels ?? [];
		if (this.props.status) {
			this.props.status.model.labelPool.forEach((aLabel) => {
				let isHas = false;
				nowLabel.forEach((nLabel) => {
					if (aLabel.equal(nLabel)) isHas = true;
				})
				if (!isHas) {
					res.push(aLabel);
				}
			})
		}
		return res;
	}

	public render(): ReactNode {
		return <div
			className="label-picker-root"
		>
			<div className="input-intro">
				<Localization i18nKey={this.props.keyI18n}/>
			</div>
			<div className="root-content">
				<LabelList
					addRef={this.addButtonRef}
					labels={this.props.labels}
					minHeight={26}
					deleteLabel={(label) => {
						this.props.labelDelete ? this.props.labelDelete(label) : 0;
					}}
					addLabel={() => {
						this.setState({
							isPickerVisible: true
						});
					}}
				/>
				{this.state.isPickerVisible ? <PickerList
                    noData="Common.Attr.Key.Label.Picker.Nodata"
					objectList={this.getOtherLabel()}
					dismiss={() => {
						this.setState({
							isPickerVisible: false
						});
					}}
					clickObjectItems={(label) => {
						if (label instanceof Label && this.props.labelAdd) {
							this.props.labelAdd(label)
						}
						this.setState({
							isPickerVisible: false
						});
					}}
					target={this.addButtonRef}
				/> : null}
			</div>
		</div>
	}
}

export { LabelPicker }