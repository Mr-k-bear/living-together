import { Component, ReactNode } from "react";
import { FontLevel, Theme } from "@Component/Theme/Theme";
import "./AttrInput.scss";
import { Icon } from "@fluentui/react";

interface IAttrInputProps {
	isNumber?: boolean;
}

class AttrInput extends Component<IAttrInputProps> {
	public render(): ReactNode {

		return <Theme
			className="attr-input"
			fontLevel={FontLevel.normal}
		>
			<div className="input-intro">
				Input
			</div>
			<div className="input-content">
				{
					this.props.isNumber ? <div className="button-left">
						<Icon iconName="ChevronLeft"></Icon>
					</div> : null
				}
				<input className="input"></input>
				{
					this.props.isNumber ? <div className="button-right">
						<Icon iconName="ChevronRight"></Icon>
					</div> : null
				}
			</div>
		</Theme>
	}
}

export { AttrInput };