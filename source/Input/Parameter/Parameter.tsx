import { Component, Fragment, ReactNode } from "react";
import { useSettingWithEvent, IMixinSettingProps, Language } from "@Context/Setting";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { ObjectID } from "@Model/Renderer";
import { TogglesInput } from "@Input/TogglesInput/TogglesInput";
import { ObjectPicker } from "@Input/ObjectPicker/ObjectPicker";
import { AllI18nKeys } from "@Component/Localization/Localization";
import { Message } from "@Input/Message/Message";
import { ColorInput } from "@Input/ColorInput/ColorInput";
import {
    IParameter, IParameterOption, IParameterOptionItem,
    IParameterValue, IParamValue, isObjectType, isVectorType
} from "@Model/Parameter";
import "./Parameter.scss";

interface IParameterProps<P extends IParameter = {}> {
    option: IParameterOption<P>;
    value: IParameterValue<P>;
    key: ObjectID;
    change: <K extends keyof P>(key: K, val: IParamValue<P[K]>) => any;
    i18n: <K extends keyof P>(option: IParameterOptionItem<P[K]>, language: Language) => string;
    title?: AllI18nKeys;
    titleOption?: Record<string, string>;
    isFirst?: boolean;
}

@useSettingWithEvent("language")
class Parameter<P extends IParameter> extends Component<IParameterProps<P> & IMixinSettingProps> {

    private renderParameter<K extends keyof P>
    (key: K, option: IParameterOptionItem<P[K]>, value: IParamValue<P[K]>): ReactNode {

        const indexKey = `${this.props.key}-${key}`;
        const type = option.type;
        const i18nString = this.props.i18n(option, this.props.setting?.language ?? "EN_US");

        if (type === "number") {
            return <AttrInput
                key={indexKey}
                id={indexKey}
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: i18nString }}
                isNumber={true}
                step={option.numberStep}
                maxLength={option.maxLength}
                max={option.numberMax}
                min={option.numberMin}
                value={value as IParamValue<"number"> ?? 0}
                valueChange={(val) => {
                    this.props.change(key, parseFloat(val) as IParamValue<P[K]>);
                }}
            />;
        }

        else if (type === "string") {
            return <AttrInput
                key={indexKey}
                id={indexKey}
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: i18nString }}
                maxLength={option.maxLength}
                value={value as IParamValue<"string"> ?? ""}
                valueChange={(val) => {
                    this.props.change(key, val as IParamValue<P[K]>);
                }}
            />;
        }

        else if (type === "boolean") {
            return <TogglesInput
                key={indexKey}
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: i18nString }}
				onIconName={option.iconName}
                red={option.iconRed}
                value={value as IParamValue<"boolean"> ?? false}
				valueChange={(val) => {
					this.props.change(key, val as IParamValue<P[K]>);
				}}
			/>
        }

        else if (isObjectType(type)) {

            type IObjectParamValue = IParamValue<"G" | "R" | "LG" | "LR">;
            const typedValue = value as IObjectParamValue;

            return <ObjectPicker
                key={indexKey}
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: i18nString }}
                type={type}
                value={typedValue.picker}
                valueChange={(obj) => {
                    typedValue.picker = obj as IObjectParamValue["picker"];
                    this.props.change(key, typedValue as IParamValue<P[K]>);
                }}
                cleanValue={() => {
                    typedValue.picker = undefined as IObjectParamValue["picker"];
                    this.props.change(key, typedValue as IParamValue<P[K]>);
                }}
            />
        }

        else if (type === "color") {

            return <ColorInput
                key={indexKey}
                keyI18n="Panel.Info.Behavior.Details.Parameter.Key"
                keyI18nOption={{ key: i18nString }}
                normal={option.colorNormal}
                value={value as IParamValue<"color"> ?? false}
                valueChange={(val) => {
					this.props.change(key, val as IParamValue<P[K]>);
				}}
            />
        }

        else if (type === "vec") {

            type IObjectParamValue = IParamValue<"vec">;
            const typedValue = value as IObjectParamValue;
            
            return <Fragment key={indexKey}>
                
                <AttrInput
                    key={`${indexKey}-X`}
                    id={indexKey}
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.X"
                    keyI18nOption={{ key: i18nString }}
                    isNumber={true}
                    step={option.numberStep}
                    maxLength={option.maxLength}
                    max={option.numberMax}
                    min={option.numberMin}
                    value={typedValue[0] ?? 0}
                    valueChange={(val) => {
                        typedValue[0] = parseFloat(val);
                        this.props.change(key, typedValue as IParamValue<P[K]>);
                    }}
                />

                <AttrInput
                    key={`${indexKey}-Y`}
                    id={indexKey}
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.Y"
                    keyI18nOption={{ key: i18nString }}
                    isNumber={true}
                    step={option.numberStep}
                    maxLength={option.maxLength}
                    max={option.numberMax}
                    min={option.numberMin}
                    value={typedValue[1] ?? 0}
                    valueChange={(val) => {
                        typedValue[1] = parseFloat(val);
                        this.props.change(key, typedValue as IParamValue<P[K]>);
                    }}
                />

                <AttrInput
                    key={`${indexKey}-Z`}
                    id={indexKey}
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.Z"
                    keyI18nOption={{ key: i18nString }}
                    isNumber={true}
                    step={option.numberStep}
                    maxLength={option.maxLength}
                    max={option.numberMax}
                    min={option.numberMin}
                    value={typedValue[2] ?? 0}
                    valueChange={(val) => {
                        typedValue[2] = parseFloat(val);
                        this.props.change(key, typedValue as IParamValue<P[K]>);
                    }}
                />

            </Fragment>
        }

        else {
            return <Fragment key={indexKey}/>
        }
    }

    private renderAllParameter(key: Array<keyof P>) {
        return key.map((key) => {
            return this.renderParameter(
                key,
                this.props.option[key],
                this.props.value[key],
            );
        });
    }
    
    public render(): ReactNode {
        const allOptionKeys: Array<keyof P> = Object.getOwnPropertyNames(this.props.option);
        
        return <>
        
            {
                allOptionKeys.length <= 0 && this.props.title ?
                    <Message
                        isTitle
                        first={this.props.isFirst}
                        i18nKey={this.props.title}
                        options={this.props.titleOption}
                    /> : null
            }

            {
                this.renderAllParameter(allOptionKeys)
            }
        
        </>
    }
}

export { Parameter }