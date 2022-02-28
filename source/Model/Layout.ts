import { Emitter } from "./Emitter";

enum LayoutDirection {
	X = 1,
	Y = 2
}

class ILayout {
	items?: [ILayout, ILayout];
	panles?: string[];
	layout?: LayoutDirection;
	scale?: number;
}

class Layout extends Emitter<{}> {

	private data: ILayout = {};

};

export { Layout, ILayout, LayoutDirection };