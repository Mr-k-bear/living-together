import { GLContextObject } from "./GLContext";

class BaseCube extends GLContextObject {

	onLoad() {
		throw new Error("Method not implemented.");
	}
}

export default GLContextObject;
export { GLContextObject };