import { Component, ReactNode, Fragment } from "react";
import { Popup } from "@Context/Popups";
import { useStatus, IMixinStatusProps, randomColor } from "@Context/Status";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { Localization } from "@Component/Localization/Localization";
import { SearchBox } from "@Input/SearchBox/SearchBox";
import { ConfirmContent } from "@Component/ConfirmPopup/ConfirmPopup";
import { BehaviorList } from "@Component/BehaviorList/BehaviorList";
import { AllBehaviorsWithCategory, ICategoryBehavior } from "@Behavior/Behavior";
import { Message } from "@Input/Message/Message";
import { IRenderBehavior, BehaviorRecorder } from "@Model/Behavior";

import "./BehaviorPopup.scss";

interface IBehaviorPopupProps {
    onDismiss?: () => void;
}

interface IBehaviorPopupState {
	searchValue: string;
	focusBehavior: Set<IRenderBehavior>;
}

class BehaviorPopup extends Popup {

	public minWidth: number = 400;
	public minHeight: number = 300;
	public width: number = 600;
	public height: number = 450;
	// public needMask: boolean = false;

	public onRenderHeader(): ReactNode {
		return <Localization i18nKey="Popup.Add.Behavior.Title"/>
	}

	public render(): ReactNode {
		return <BehaviorPopupComponent onDismiss={() => {
            this.close();
        }}/>
	}
}

@useStatus
@useSettingWithEvent("language")
class BehaviorPopupComponent extends Component<
	IBehaviorPopupProps & IMixinStatusProps & IMixinSettingProps, IBehaviorPopupState
> {

	state: Readonly<IBehaviorPopupState> = {
		searchValue: "",
		focusBehavior: new Set<IRenderBehavior>()
	};

	private renderHeader = () => {
		return <div className="behavior-popup-search-box">
			<SearchBox
				valueChange={(value) => {
					this.setState({
						searchValue: value
					});
				}}
				value={this.state.searchValue}
			/>
		</div>;
	}

	private renderActionBar = () => {
		return <Localization
			className="behavior-popup-select-counter"
			i18nKey="Popup.Add.Behavior.Select.Counter"
			options={{
				count: this.state.focusBehavior.size.toString()
			}}
		/>
	}

    private renderBehaviors = (behaviors: ICategoryBehavior, first: boolean) => {

        let language = this.props.setting?.language ?? "EN_US";
        let filterReg: RegExp | undefined = undefined;
        if (this.state.searchValue) {
            filterReg = new RegExp(this.state.searchValue, "i");
        }
        let filterItem = behaviors.item.filter((item) => {
            let name = item.getTerms(item.behaviorName, this.props.setting?.language);
            if (filterReg) {
                return filterReg.test(name);
            } else {
                return true;
            }
        })
        
        if (filterItem.length <= 0) return undefined;

        return <Fragment key={behaviors.key}>
            <Message
                text={behaviors.category[language] ?? behaviors.key}
                first={first} isTitle
            />
			<BehaviorList
				focusBehaviors={Array.from(this.state.focusBehavior)}
				behaviors={filterItem}
				click={(behavior) => {
					if (this.state.focusBehavior.has(behavior)) {
						this.state.focusBehavior.delete(behavior);
					} else {
						this.state.focusBehavior.add(behavior);
					}
					this.forceUpdate();
				}}
			/>
        </Fragment>
    }

    private addSelectBehavior = () => {
        this.state.focusBehavior.forEach((recorder) => {
            if (this.props.status && recorder instanceof BehaviorRecorder) {
                let newBehavior = this.props.status.model.addBehavior(recorder);

                // 根据用户的命名搜索下一个名字
                let searchKey = recorder.getTerms(
                    recorder.behaviorName, this.props.setting?.language
                );
                
                let nextIndex = 1;
                this.props.status.model.behaviorPool.forEach((obj) => {
                    if (obj.behaviorId === recorder.behaviorId && obj.name.indexOf(searchKey) >= 0) {
                        let searchRes = obj.name.match(/(\d+)$/);
                        if (searchRes) {
                            let nameNumber = parseInt(searchRes[1]);
                            if (!isNaN(nameNumber)) {
                                nextIndex = Math.max(nextIndex, nameNumber + 1);
                            }
                        }
                    }
                });

                // 初始化名字
                newBehavior.name = `${searchKey} ${nextIndex}`;

                // 赋予一个随机颜色
                newBehavior.color = randomColor(true);
            }
        });
        this.props.onDismiss ? this.props.onDismiss() : undefined;
    }

	public render(): ReactNode {
        let first: boolean = true;
        let behaviorNodes = AllBehaviorsWithCategory.map((behavior) => {
            let renderItem = this.renderBehaviors(behavior, first);
            if (renderItem) {
                first = false;
            }
            return renderItem;
        }).filter((x) => !!x);

		return <ConfirmContent
			className="behavior-popup"
			actions={[{
				i18nKey: "Popup.Add.Behavior.Action.Add",
				disable: this.state.focusBehavior.size <= 0,
                onClick: this.addSelectBehavior
			}]}
			header={this.renderHeader}
			customFooter={this.renderActionBar}
			headerHeight={46}
		>
            {
                behaviorNodes.length ? behaviorNodes :
                <Message
                    className="behavior-popup-no-data"
                    i18nKey="Popup.Add.Behavior.Select.Nodata" first
                    options={{ name: this.state.searchValue }}
                />
            }
		</ConfirmContent>
	}
}

export { BehaviorPopup };