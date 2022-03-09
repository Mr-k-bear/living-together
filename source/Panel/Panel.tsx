import { ReactNode, Component, FunctionComponent } from "react";
import { Theme } from "@Component/Theme/Theme";
import { ErrorMessage } from "@Component/ErrorMessage/ErrorMessage";
import { RenderView } from "./RenderView/RenderView";
import { ObjectList } from "./ObjectList/ObjectList";
import { ObjectCommand } from "./ObjectList/ObjectCommand";
import { RangeDetails } from "./RangeDetails/RangeDetails";
import { LabelList } from "./LabelList/LabelList";
import { LabelListCommand } from "./LabelList/LabelListCommand";

interface IPanelInfo {
	nameKey: string;
	introKay: string;
	class: (new (...p: any) => Component) | FunctionComponent;
	header?: (new (...p: any) => Component) | FunctionComponent;
	hidePadding?: boolean;
	hideScrollBar?: boolean;
    isDeepDark?: boolean;
	option?: Record<string, string>;
}

type PanelId = ""
| "RenderView" // 主渲染器
| "ObjectList" // 对象列表
| "RangeDetails" // 范围属性
| "LabelList" // 标签列表
;

const PanelInfoMap = new Map<PanelId, IPanelInfo>();
PanelInfoMap.set("RenderView", { 
	nameKey: "Panel.Title.Render.View", introKay: "Panel.Info.Render.View",
    class: RenderView, hidePadding: true, hideScrollBar: true, isDeepDark: true
});
PanelInfoMap.set("ObjectList", {
    nameKey: "Panel.Title.Object.List.View", introKay: "Panel.Info.Object.List.View",
    class: ObjectList, header: ObjectCommand, hidePadding: true
})
PanelInfoMap.set("RangeDetails", {
    nameKey: "Panel.Title.Range.Details.View", introKay: "Panel.Info.Range.Details.View",
    class: RangeDetails
})
PanelInfoMap.set("LabelList", {
    nameKey: "Panel.Title.Label.List.View", introKay: "Panel.Info.Label.List.View",
    class: LabelList, header: LabelListCommand, hidePadding: true
})

function getPanelById(panelId: PanelId): ReactNode {
	switch (panelId) {
		default: 
			let info = PanelInfoMap.get(panelId);
			if (info) {
				const C = info.class;
				return <C></C>
			} else return <Theme>
				<ErrorMessage i18nKey={"Panel.Info.Notfound"} options={{ id: panelId }}/>
			</Theme>
	}
}

function getPanelInfoById(panelId: PanelId): IPanelInfo | undefined {
	return PanelInfoMap.get(panelId);
}

export { PanelId, getPanelById, getPanelInfoById}