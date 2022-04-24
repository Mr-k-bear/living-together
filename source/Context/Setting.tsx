import { createContext } from "react";
import { superConnect, superConnectWithEvent } from "@Context/Context";
import { Emitter } from "@Model/Emitter";
import { Layout } from "@Context/Layout";

/**
 * 主题模式
 */
enum Themes {
    light = 1,
    dark = 2
}

enum Platform {
    web = 1,
    desktop = 2
}

type Language = "ZH_CN" | "EN_US";

interface ISettingEvents extends Setting {
    attrChange: keyof Setting;
}

class Setting extends Emitter<ISettingEvents> {

    /**
     * 程序平台
     */
    public platform: Platform = Platform.web;

    /**
     * 主题
     */
    public themes: Themes = Themes.dark;

    /**
     * 语言
     */
    public language: Language = "ZH_CN";

    /**
     * 布局
     */
    public layout: Layout = new Layout();

    /**
     * 设置参数
     */
    public setProps<P extends keyof Setting>(key: P, value: Setting[P]) {
        this[key] = value as any;
        this.emit("attrChange", key);
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

/**
 * 修饰器
 */
const useSetting = superConnect<Setting>(SettingConsumer, "setting");

const useSettingWithEvent = superConnectWithEvent<Setting, ISettingEvents>(SettingConsumer, "setting");

export {
    Themes, Setting, SettingContext, useSetting, Language, useSettingWithEvent,
    IMixinSettingProps, SettingProvider, SettingConsumer, Platform
};