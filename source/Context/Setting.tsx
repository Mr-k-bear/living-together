import { createContext, Component, FunctionComponent } from "react";
import { Emitter } from "@Model/Emitter";
import { Layout } from "@Model/Layout";

/**
 * 主题模式
 */
enum Themes {
    light = 1,
    dark = 2
}

type Language = "ZH_CN" | "EN_US";

class Setting extends Emitter<
    Setting & {change: keyof Setting}
> {

    /**
     * 主题
     */
    public themes: Themes = Themes.dark;

    /**
     * 语言
     */
    public language: Language = "EN_US";

    /**
     * 布局
     */
    public layout: Layout = new Layout();

    /**
     * 设置参数
     */
    public setProps<P extends keyof Setting>(key: P, value: Setting[P]) {
        this[key] = value as any;
        this.emit("change", key);
        this.emit(key as any, value as any);
    }
}

interface IMixinSettingProps {
    setting?: Setting;
}

const SettingContext = createContext<Setting>(new Setting());

SettingContext.displayName = "Setting";
const SettingProvider = SettingContext.Provider;
const SettingConsumer = SettingContext.Consumer;

type RenderComponent = (new (...p: any) => Component<any, any, any>) | FunctionComponent<any>;

/**
 * 修饰器
 */
function useSetting<R extends RenderComponent>(components: R): R {
    return ((props: any) => {
        const C = components;
        return <SettingConsumer>
            {(setting: Setting) => <C {...props} setting={setting}></C>}
        </SettingConsumer>
    }) as any;
}

export {
    Themes, Setting, SettingContext, useSetting, Language,
    IMixinSettingProps, SettingProvider, SettingConsumer
};