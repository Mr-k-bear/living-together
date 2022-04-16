const FS =  require("fs");
const Path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));

const PackageJSON = JSON.parse(
	FS.readFileSync(Path.join(__dirname, "../package.json"))
);

const Config = {
	"name": PackageJSON.name,
	"productName": PackageJSON.name,
	"version": PackageJSON.version,
	"description": PackageJSON.description,
	"main": "./Electron.js",
	"scripts": {
		"start": "electron-forge start",
		"package": "electron-forge package",
		"make": "electron-forge make",
		"publish": "electron-forge publish",
		"lint": "echo \"No linting configured\""
	},
	"keywords": PackageJSON.keywords,
	"author": {
		"name": PackageJSON.author,
		"email": "mrkbear@qq.com"
	},
	"license": PackageJSON.license,
	"config": {
		"forge": {
			"packagerConfig": {},
			"makers": [
				{
					"name": "@electron-forge/maker-zip",
					"platforms": [
						"darwin"
					]
				}
			]
		}
	},
	"dependencies": {
		"electron-squirrel-startup": "^1.0.0",
		"detect-port": PackageJSON.dependencies["detect-port"],
    	"express": PackageJSON.dependencies["express"],
	},
	"devDependencies": {
		"@electron-forge/cli": "^6.0.0-beta.63",
		"@electron-forge/maker-zip": "^6.0.0-beta.63",
		"electron": PackageJSON.devDependencies.electron
	}
}

FS.writeFileSync(Path.join(Path.resolve("./"), args.out ?? "./", "./package.json"), JSON.stringify(Config, null, 4));