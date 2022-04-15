import { Service } from "@Service/Service";
import * as minimist from "minimist";

const args = minimist(process.argv.slice(2));

if (args.run) {
	new Service().run(args.path, args.port);
}