import { Component, Fragment, ReactNode } from "react";
import { useSettingWithEvent, IMixinSettingProps, Language } from "@Context/Setting";
import { AttrInput } from "@Input/AttrInput/AttrInput";
import { ObjectID } from "@Model/Model";
import { TogglesInput } from "@Input/TogglesInput/TogglesInput";
import { ObjectPicker } from "@Input/ObjectPicker/ObjectPicker";
import { AllI18nKeys, I18N } from "@Component/Localization/Localization";
import { Message } from "@Input/Message/Message";
import { ColorInput } from "@Input/ColorInput/ColorInput";
import { ComboInput, IDisplayItem } from "@Input/ComboInput/ComboInput";
import {
    IParameter, IParameterOption, IParameterOptionItem,
    IParameterValue, IParamValue, isObjectType
} from "@Model/Parameter";
import "./Parameter.scss";

interface IParameterProps<P extends IParameter = {}> {
    option: IParameterOption<P>;
    value: IParameterValue<P>;
    key: ObjectID;
    change: <K extends keyof P>(key: K, val: IParamValue<P[K]>) => any;
    i18n?: (key: string, language: Language) => string;
    renderKey?: Array<keyof P>;
    title?: AllI18nKeys;
    titleOption?: Record<string, string>;
    isFirst?: boolean;
}

@useSettingWithEvent("language")
class Parameter<P extends IParameter> extends Component<IParameterProps<P> & IMixinSettingProps> {

    private renderParameter<K extends keyof P>
    (key: K, option: IParameterOptionItem<P[K]>, value: IParamValue<P[K]>): ReactNode {

        const language = this.props.setting?.language ?? "EN_US";
        const indexKey = `${this.props.key}-${key}`;
        const type = option.type;
        let keyI18n: string, keyI18nOption: Record<string, string> | undefined;

        // Custom I18N
        if (this.props.i18n) {
            keyI18n = "Panel.Info.Behavior.Details.Parameter.Key";
            keyI18nOption = {
                key: this.props.i18n(option.name, language)
            };
        }
        
        else {
            keyI18n = option.name;
        }

        if (type === "number") {
            return <AttrInput
                key={indexKey}
                id={indexKey}
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
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
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
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
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
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
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
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
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
                normal={option.colorNormal}
                value={value as IParamValue<"color"> ?? false}
                valueChange={(val) => {
					this.props.change(key, val as IParamValue<P[K]>);
				}}
            />
        }

        else if (type === "option") {

            let allOption: IDisplayItem[] = [];
            let focusKey: number = -1;

            if (option.allOption) {
                for (let i = 0; i < option.allOption.length; i++) {

                    if (this.props.i18n) {
                        allOption.push({
                            i18nOption: { key: this.props.i18n(option.allOption[i].name, language) },
                            i18n: "Panel.Info.Behavior.Details.Parameter.Key",
                            key: option.allOption[i].key
                        })
                    }
                    
                    else {
                        allOption.push({
                            i18n: option.allOption[i].name,
                            key: option.allOption[i].key
                        })
                    }

                    if (option.allOption[i].key === value) {
                        focusKey = i;
                    }
                }
            }

            return <ComboInput
                key={indexKey}
                keyI18n={keyI18n}
                keyI18nOption={keyI18nOption}
                allOption={allOption}
                value={allOption[focusKey]}
                valueChange={(val) => {
                    this.props.change(key, val.key as IParamValue<P[K]>);
                }}
            />
        }

        else if (type === "vec") {

            type IObjectParamValue = IParamValue<"vec">;
            const typedValue = value as IObjectParamValue;
            const i18nVal = I18N(this.props, keyI18n, keyI18nOption);
            
            return <Fragment key={indexKey}>
                
                <AttrInput
                    key={`${indexKey}-X`}
                    id={indexKey}
                    keyI18n="Panel.Info.Behavior.Details.Parameter.Key.Vec.X"
                    keyI18nOption={{ key: i18nVal }}
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
                    keyI18nOption={{ key: i18nVal }}
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
                    keyI18nOption={{ key: i18nVal }}
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
        
        let allOptionKeys: Array<keyof P>;
        if (this.props.renderKey) {
            allOptionKeys = this.props.renderKey;
        } else {
            allOptionKeys = Object.getOwnPropertyNames(this.props.option);
        }

        return <>
        
            {
                allOptionKeys.length > 0 && this.props.title ?
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