import { Component, Fragment, ReactNode} from "react";
import { useSettingWithEvent, IMixinSettingProps } from "@Context/Setting";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { Behavior, IBehaviorParameter, isObjectType, isVectorType } from "@Model/Behavior";
import { Message } from "@Component/Message/Message";
import { AttrInput } from "@Component/AttrInput/AttrInput";
import { ColorInput } from "@Component/ColorInput/ColorInput";
import { TogglesInput } from "@Component/TogglesInput/TogglesInput";
import { ConfirmPopup } from "@Component/ConfirmPopup/ConfirmPopup";
import { ObjectPicker } from "@Component/ObjectPicker/ObjectPicker";
import "./BehaviorDetails.scss";

interface IBehaviorDetailsProps {}

@useSettingWithEvent("language")
@useStatusWithEvent("focusBehaviorChange", "behaviorAttrChange")
class BehaviorDetails extends Component<IBehaviorDetailsProps & IMixinStatusProps & IMixinSettingProps> {

	private renderFrom<T extends IBehaviorParameter>
    (behavior: Behavior<T, Record<string, any>>): ReactNode {

        const allParameterKeys = Object.getOwnPropertyNames(behavior.parameterOption);

		return <>
        
            <Message i18nKey="Common.Attr.Title.Basic" isTitle first/>

            <AttrInput
                id={behavior.id} keyI18n="Common.Attr.Key.Display.Name" value={behavior.name}
                valueChange={(val) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "name", val, true);
                }}
            />

            <ColorInput
                keyI18n="Common.Attr.Key.Color"
                value={behavior.color}
                valueChange={(color) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, "color", color, true);
                }}
            />

            <TogglesInput
				keyI18n="Common.Attr.Key.Delete" red
				onIconName="delete" offIconName="delete"
				valueChange={() => {
					if (this.props.status) {
                        const status = this.props.status;
                        status.popup.showPopup(ConfirmPopup, {
                            infoI18n: "Popup.Delete.Behavior.Confirm",
                            titleI18N: "Popup.Action.Objects.Confirm.Title",
                            yesI18n: "Popup.Action.Objects.Confirm.Delete",
                            red: "yes",
                            yes: () => {
                                status.model.deleteBehavior(behavior);
                                status.setBehaviorObject();
                            }
                        })
                    }
				}}
			/>

            {
                allParameterKeys.length > 0 ?
                    <Message
                        isTitle
                        i18nKey="Panel.Info.Behavior.Details.Behavior.Props"
                        options={{
                            behavior: behavior.getTerms(behavior.behaviorName, this.props.setting?.language)
                        }}
                    /> : null
            }
            
            {
                allParameterKeys.map((key) => {
                    return this.renderParameter(behavior, key);
                })
            }

        </>;
	}

    private renderParameter<T extends IBehaviorParameter>
    (behavior: Behavior<T, Record<string, any>>, key: keyof T): ReactNode {
        const type = behavior.parameterOption[key];
        const value = behavior.parameter[key];
        const indexKey = `${behavior.id}-${key}`;

        if (type.type === "number") {
            return <AttrInput
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                key={indexKey} id={indexKey} isNumber={true} step={type.numberStep} maxLength={type.maxLength}
                max={type.numberMax} min={type.numberMin}
                value={(value as number) ?? 0}
                valueChange={(val) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, key as string, (val as any) / 1);
                }}
            />
        }

        if (type.type === "string") {
            return <AttrInput
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                key={indexKey} id={indexKey} maxLength={type.maxLength}
                value={(value as string) ?? ""}
                valueChange={(val) => {
                    this.props.status?.changeBehaviorAttrib(behavior.id, key as string, val);
                }}
            />
        }

        if (type.type === "boolean") {
            return <TogglesInput
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
				onIconName={type.iconName} key={indexKey} value={(value as boolean) ?? false}
				valueChange={(val) => {
					this.props.status?.changeBehaviorAttrib(behavior.id, key as string, val);
				}}
			/>
        }

        if (isObjectType(type.type as any)) {
            return <ObjectPicker
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                type={type.type} value={(value as any).picker}
                valueChange={(obj) => {
                    (value as any).picker = obj;
                    this.props.status?.changeBehaviorAttrib(behavior.id, key as string, value);
                }}
                cleanValue={() => {
                    (value as any).picker = undefined;
                    this.props.status?.changeBehaviorAttrib(behavior.id, key as string, value);
                }}
            />
        }

        if (isVectorType(type.type as any)) {
            return <Fragment key={indexKey}>
                
                <AttrInput
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.X"
                    keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                    key={`${indexKey}-X`} id={indexKey} isNumber={true} step={type.numberStep} maxLength={type.maxLength}
                    max={type.numberMax} min={type.numberMin}
                    value={(value as number[])[0] ?? 0}
                    valueChange={(val) => {
                        (value as number[])[0] = (val as any) / 1;
                        this.props.status?.changeBehaviorAttrib(behavior.id, key as string, value);
                    }}
                />

                <AttrInput
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.Y"
                    keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                    key={`${indexKey}-Y`} id={indexKey} isNumber={true} step={type.numberStep} maxLength={type.maxLength}
                    max={type.numberMax} min={type.numberMin}
                    value={(value as number[])[1] ?? 0}
                    valueChange={(val) => {
                        (value as number[])[1] = (val as any) / 1;
                        this.props.status?.changeBehaviorAttrib(behavior.id, key as string, value);
                    }}
                />

                <AttrInput
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.Z"
                    keyI18nOption={{ key: behavior.getTerms(type.name, this.props.setting?.language) }}
                    key={`${indexKey}-Z`} id={indexKey} isNumber={true} step={type.numberStep} maxLength={type.maxLength}
                    max={type.numberMax} min={type.numberMin}
                    value={(value as number[])[2] ?? 0}
                    valueChange={(val) => {
                        (value as number[])[2] = (val as any) / 1;
                        this.props.status?.changeBehaviorAttrib(behavior.id, key as string, value);
                    }}
                />

            </Fragment>
        }

        return <Fragment key={indexKey}/>
    }

	public render(): ReactNode {
		if (this.props.status && this.props.status.focusBehavior) {
            return this.renderFrom(this.props.status.focusBehavior);
        }
		return <Message i18nKey="Panel.Info.Behavior.Details.Error.Not.Behavior"/>;
	}
}

export { BehaviorDetails };