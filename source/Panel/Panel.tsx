import { ReactNode, Component, FunctionComponent } from "react";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";
import { RenderView } from "./RenderView/RenderView";
import { ObjectList } from "./ObjectList/ObjectList";
import { ObjectCommand } from "./ObjectList/ObjectCommand";

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

function getPanelById(panelId: PanelId): ReactNode {
	switch (panelId) {
		default: 
			let info = PanelInfoMap.get(panelId);
			if (info) {
				const C = info.class;
				return <C></C>
			} else return <Theme>
				<Localization i18nKey={"Panel.Info.Notfound"} options={{
					id: panelId
				}}/>
			</Theme>
	}
}

function getPanelInfoById(panelId: PanelId): IPanelInfo | undefined {
	return PanelInfoMap.get(panelId);
}

export { PanelId, getPanelById, getPanelInfoById}