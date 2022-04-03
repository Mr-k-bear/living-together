import { Component, ReactNode} from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Behavior } from "@Model/Behavior";
import { Message } from "@Component/Message/Message";
import "./BehaviorDetails.scss";

interface IBehaviorDetailsProps {}

@useStatusWithEvent("focusBehaviorChange")
class BehaviorDetails extends Component<IBehaviorDetailsProps & IMixinStatusProps> {

	private renderFrom(behavior: Behavior): ReactNode {
		return <></>;
	}

	public render(): ReactNode {
		if (this.props.status) {
            if (this.props.status.focusBehavior) {
                return this.renderFrom(this.props.status.focusBehavior);
            }
        }
		return <Message i18nKey="Panel.Info.Behavior.Details.Error.Not.Behavior"/>;
	}
}

export { BehaviorDetails };