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
	id?: number;
}

interface ILayoutEvent {
	layoutChange: Layout;
	scaleChange: Layout;
}

class Layout extends Emitter<ILayoutEvent> {

	private id: number = 0;

	private data: ILayout = {};

	private map(fn: (layout: ILayout) => boolean | void, layout?: ILayout) {
		const currentLayout = layout ? layout : this.data;
		if( fn(currentLayout) ) return;
		if (currentLayout.items && currentLayout.items[0]) {
			this.map(fn, currentLayout.items[0]);
		}
		if (currentLayout.items && currentLayout.items[1]) {
			this.map(fn, currentLayout.items[1]);
		}
	}

	public getData = (): ILayout => {
		return this.data;
	}

	public setData = (data: ILayout) => {
		this.data = data;
		this.id = 0;
		this.map((layout) => {
			layout.id = this.id;
			this.id ++;
		});
		this.emit("layoutChange", this);
	}

	public setScale = (id: number, scale: number) => {
		let change = false;
		this.map((layout) => {
			if (layout.id === id) {
				layout.scale = scale;
				change = true;	
			}
			return change;
		})
		if (change) {
			this.emit("scaleChange", this);
		}
	}
};

export { Layout, ILayout, LayoutDirection };