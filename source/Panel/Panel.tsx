import { ReactNode } from "react";
import { Theme } from "@Component/Theme/Theme";
import { Localization } from "@Component/Localization/Localization";

interface IPanelInfo {
	nameKey: string;
	introKay: string;
	option?: Record<string, string>;
}

type PanelId = ""
| "RenderView" // 主渲染器
;

const PanelInfoMap = new Map<PanelId, IPanelInfo>();
PanelInfoMap.set("RenderView", { nameKey: "", introKay: "" });

function getPanelById(panelId: PanelId): ReactNode {
	return <Theme>
		<Localization i18nKey={"Panel.Info.Notfound"} options={{
			id: panelId
		}}/>
	</Theme>
}

function getPanelInfoById(panelId: PanelId): IPanelInfo | undefined {
	return PanelInfoMap.get(panelId);
}

export { PanelId, getPanelById, getPanelInfoById}