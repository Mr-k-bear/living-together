import { ReactNode, Component, FunctionComponent } from "react";
import { Theme } from "@Component/Theme/Theme";
import { Message } from "@Input/Message/Message";
import { RenderView } from "@Panel/RenderView/RenderView";
import { ObjectList } from "@Panel/ObjectList/ObjectList";
import { ObjectCommand } from "@Panel/ObjectList/ObjectCommand";
import { RangeDetails } from "@Panel/RangeDetails/RangeDetails";
import { LabelList } from "@Panel/LabelList/LabelList";
import { LabelDetails } from "@Panel/LabelDetails/LabelDetails";
import { GroupDetails } from "@Panel/GroupDetails/GroupDetails";
import { BehaviorList } from "@Panel/BehaviorList/BehaviorList";
import { BehaviorDetails } from "@Panel/BehaviorDetails/BehaviorDetails";
import { ClipPlayer } from "@Panel/ClipPlayer/ClipPlayer";
import { ClipRecorder } from "@Panel/ClipPlayer/ClipRecorder";

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
| "LabelDetails" // 标签属性
| "GroupDetails" // 群属性
| "BehaviorList" // 行为列表
| "BehaviorDetails" // 行为属性
| "ClipPlayer" // 剪辑影片
;

const PanelInfoMap = new Map<PanelId, IPanelInfo>();
PanelInfoMap.set("RenderView", { 
	nameKey: "Panel.Title.Render.View", introKay: "Panel.Info.Render.View",
    class: RenderView, hidePadding: true, hideScrollBar: true, isDeepDark: true
});
PanelInfoMap.set("ObjectList", {
    nameKey: "Panel.Title.Object.List.View", introKay: "Panel.Info.Object.List.View",
    class: ObjectList, header: ObjectCommand, hidePadding: true
});
PanelInfoMap.set("RangeDetails", {
    nameKey: "Panel.Title.Range.Details.View", introKay: "Panel.Info.Range.Details.View",
    class: RangeDetails
});
PanelInfoMap.set("LabelList", {
    nameKey: "Panel.Title.Label.List.View", introKay: "Panel.Info.Label.List.View",
    class: LabelList, hidePadding: true
});
PanelInfoMap.set("LabelDetails", {
    nameKey: "Panel.Title.Label.Details.View", introKay: "Panel.Info.Label.Details.View",
    class: LabelDetails
});
PanelInfoMap.set("GroupDetails", {
    nameKey: "Panel.Title.Group.Details.View", introKay: "Panel.Info.Group.Details.View",
    class: GroupDetails
});
PanelInfoMap.set("BehaviorList", {
    nameKey: "Panel.Title.Behavior.List.View", introKay: "Panel.Info.Behavior.List.View",
    class: BehaviorList, hidePadding: true
});
PanelInfoMap.set("BehaviorDetails", {
    nameKey: "Panel.Title.Behavior.Details.View", introKay: "Panel.Info.Behavior.Details.View",
    class: BehaviorDetails
});
PanelInfoMap.set("ClipPlayer", {
    nameKey: "Panel.Title.Behavior.Clip.Player", introKay: "Panel.Info.Behavior.Clip.Player",
    class: ClipPlayer, header: ClipRecorder, hidePadding: true
});

function getPanelById(panelId: PanelId): ReactNode {
	switch (panelId) {
		default: 
			let info = PanelInfoMap.get(panelId);
			if (info) {
				const C = info.class;
				return <C></C>
			} else return <Theme>
				<Message i18nKey={"Panel.Info.Notfound"} options={{ id: panelId }}/>
			</Theme>
	}
}

function getPanelInfoById(panelId: PanelId): IPanelInfo | undefined {
	return PanelInfoMap.get(panelId);
}

export { PanelId, getPanelById, getPanelInfoById}