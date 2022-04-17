const { Entry, Output, resolve, TypeScriptRules } = require("./webpack.common");
const nodeExternals = require("webpack-node-externals");

const AllEntry = Entry();

module.exports = (env) => {
    
    const config = {

        entry: {
            Service: AllEntry.Service,
			Electron: AllEntry.Electron,
            SimulatorWindow: AllEntry.SimulatorWindow
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

        // externals: [nodeExternals({ allowlist: [/^(((?!electron).)*)$/] })],
        externals: [nodeExternals()],

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