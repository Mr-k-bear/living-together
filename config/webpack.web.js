const { 
    Entry, Output, resolve, build,
    TypeScriptRules, ScssRules,
    HTMLPage, CssPlugin, AutoFixCssPlugin
} = require("./webpack.common");

const AllEntry = Entry();

module.exports = (env) => {
    
    const config = {

        entry: {
            GLRender: AllEntry.GLRender,
            Model: AllEntry.Model,
            SimulatorWeb: AllEntry.SimulatorWeb
        },

        output: Output("[name].[contenthash].js"),
        devtool: 'source-map',
        mode: "development",
        resolve: resolve(),

        optimization: {
            runtimeChunk: 'single',
            chunkIds: 'named',
            moduleIds: 'named',
            splitChunks: {
                chunks: 'all',
                minSize: 1000
            }
        },

        module: {
            rules: [
                TypeScriptRules(),
                ScssRules()
            ]
        },
        
        plugins: [
            HTMLPage("index.html", "Living Together | Simulator"),
            CssPlugin(),
            AutoFixCssPlugin()
        ],
        
        devServer: {
            static: {
                directory: build("./"),
            },
            port: 12000,
        }
    };

    return config;
};