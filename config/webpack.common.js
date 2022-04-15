const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoPrefixer = require('autoprefixer');

const Path = require("path");
const ProjectPath = Path.resolve(__dirname, "../");
const SourcePath = Path.resolve(ProjectPath, "./source");
const BuildPath = Path.resolve(ProjectPath, "./build");
const AssetsPath = Path.resolve(ProjectPath, "./assets");

/**
 * 解析项目路径
 * @param {string} path 相对项目根目录的路径
 * @return {string} 解析路径
 */
function project(path) {
    return Path.resolve(ProjectPath, path);
}

/**
 * 解析源文件路径
 * @param {string} path 相对源文件的路径
 * @return {string} 解析路径
 */
function source(path) {
    return Path.resolve(SourcePath, path);
}

/**
 * 解析编译文件路径
 * @param {string} path 相对编译文件的路径
 * @return {string} 解析路径
 */
function build(path) {
    return Path.resolve(BuildPath, path);
}

/**
 * 解析资源文件路径
 * @param {string} path 相对资源文件的路径
 * @return {string} 解析路径
 */
function assets(path) {
    return Path.resolve(AssetsPath, path);
}

/**
 * 项目入口
 */
const Entry = () => ({
        
    Model: {
        import: source("./Model/Model.ts")
    },

    GLRender: {
        import: source("./GLRender/ClassicRenderer.ts")
    },

    LaboratoryPage: {
        import: source("./Page/Laboratory/Laboratory.tsx"),
        dependOn: ["Model", "GLRender"]
    },

    SimulatorWeb: {
        import: source("./Page/SimulatorWeb/SimulatorWeb.tsx"),
        dependOn: ["Model", "GLRender"]
    },

    SimulatorDesktop: {
        import: source("./Page/SimulatorDesktop/SimulatorDesktop.tsx"),
        dependOn: ["Model", "GLRender"]
    },

    Service: {
        import: source("./Service/Service.ts")
    },

    ServiceRunner: {
        import: source("./Service/Runner.ts"),
        dependOn: ["Service"]
    }
});

/**
 * 项目输出
 * @param {string} name 输出名字
 * @returns 输出配置
 */
const Output = (name = "[name].js") => ({
    filename: name,
    path: BuildPath
});

const TypeScriptRules = () => ({
    test: /\.tsx?$/,
    use: [
        {
            loader: "ts-loader",
            options: {
                configFile: project("./tsconfig.json")
            }
        },
    ]
});

const ScssRules = () => ({
    test:/\.(sass|scss)$/,
    use:[MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
});

const resolve = (plugins = []) => {

    let res = {
        extensions: [ ".tsx", '.ts', '.js' ],
        plugins: plugins
    };

    res.plugins.push(
        new TsconfigPathsPlugin({
            baseUrl: ProjectPath,
            configFile: project("./tsconfig.json")
        })
    )

    return res;
};

/**
 * 使用模板
 * @param {string} url 使用的模板路径
 * @returns HTML插件
 */
const HTMLPage = (name, title) => {
    return new HtmlWebpackPlugin({
        xhtml: true,
        title: title ?? "Living Together",
        favicon: assets("./favicon.ico"),
        filename: build(name ?? "index.html"),
        template: assets("index.html")
    });
}

const CssPlugin = () => new MiniCssExtractPlugin();

const AutoFixCssPlugin = () => AutoPrefixer;

module.exports = {
    project, source, assets, build,
    Entry, Output, resolve,
    TypeScriptRules, ScssRules,
    HTMLPage, CssPlugin, AutoFixCssPlugin
}