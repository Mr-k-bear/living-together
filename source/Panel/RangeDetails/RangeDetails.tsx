import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import "./RangeDetails.scss";

class RangeDetails extends Component {
	public render(): ReactNode {
		return <div>
			<AttrInput keyI18n="Common.Attr.Key.Display.Name"></AttrInput>
			<AttrInput keyI18n="Common.Attr.Key.Position.X" isNumber></AttrInput>
            <AttrInput keyI18n="Common.Attr.Key.Position.Y" isNumber></AttrInput>
            <AttrInput keyI18n="Common.Attr.Key.Position.Z" isNumber></AttrInput>
		</div>
	}
}

export { RangeDetails };