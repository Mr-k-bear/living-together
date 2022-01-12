const { 
    Entry, Output, resolve, build,
    TypeScriptRules, ScssRules,
    HTMLPage, CssPlugin, AutoFixCssPlugin
} = require("./webpack.common");

const AllEntry = Entry();

module.exports = (env) => {
    
    const config = {

        entry: {
            Model: AllEntry.Model,
            LaboratoryPage: AllEntry.LaboratoryPage
        },

        output: Output("[name].js"),
        devtool: 'source-map',
        mode: "development",
        resolve: resolve(),

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

        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    }
                }
            }
        },
        
        devServer: {
            static: {
                directory: build("./"),
            },
            port: 12000,
        }
    };

    return config;
};