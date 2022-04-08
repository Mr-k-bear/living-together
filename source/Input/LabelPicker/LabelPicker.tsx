import { Component, ReactNode, createRef } from "react";
import { Label } from "@Model/Label";
import { PickerList } from "@Input/PickerList/PickerList";
import { TextField, ITextFieldProps } from "@Input/TextField/TextField";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { LabelList } from "@Component/LabelList/LabelList";
import "./LabelPicker.scss"

interface ILabelPickerProps extends ITextFieldProps {
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

    private renderPicker() {
        return <PickerList
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
        />;
    }

	public render(): ReactNode {
		return <TextField
            {...this.props}
            className="label-picker"
            customHoverStyle
            customStyle
            keyI18n={this.props.keyI18n}
        >
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
            {this.state.isPickerVisible ? this.renderPicker(): null}
        </TextField>;
	}
}

export { LabelPicker }