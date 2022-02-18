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
            LaboratoryPage: AllEntry.LaboratoryPage
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
            HTMLPage("Laboratory.html", "Living Together | Laboratory"),
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