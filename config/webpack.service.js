const { Entry, Output, resolve, TypeScriptRules } = require("./webpack.common");

const AllEntry = Entry();

module.exports = (env) => {
    
    const config = {

        entry: {
            Service: AllEntry.Service,
			ServiceRunner: AllEntry.ServiceRunner,
        },

        output: Output("[name].js"),
        devtool: 'source-map',
        mode: "development",
        resolve: resolve(),

        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 1000
            }
        },

        module: {
            rules: [
                TypeScriptRules()
            ]
        },

		node: {
			__filename: false,
			__dirname: false
		},

		target: 'node'
    };

    return config;
};