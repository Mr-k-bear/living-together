import { Component, ReactNode } from "react";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import "./RangeDetails.scss";

class RangeDetails extends Component {
	public render(): ReactNode {
		return <div>
			<AttrInput></AttrInput>
			<AttrInput isNumber></AttrInput>
		</div>
	}
}

export { RangeDetails };