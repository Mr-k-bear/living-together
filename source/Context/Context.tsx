import { Emitter, EventType } from "@Model/Emitter";
import { Component, FunctionComponent, ReactNode, Consumer } from "react";

type RenderComponent = (new (...p: any) => Component<any, any, any>) | FunctionComponent<any>;

function superConnect<C extends Emitter<E>, E extends Record<EventType, any>>(
	consumer: Consumer<C>
) {
	return (...events: Array<keyof E>) => {
		return <R extends RenderComponent>(components: R): R => {
			const C = components as any;
			return class extends Component<R> {
	
				private status: C | undefined;
				private isEventMount: boolean = false;
	
				private handelChange = () => {
					this.forceUpdate();
				}
	
				private mountEvent() {
					if (this.status && !this.isEventMount) {
						this.isEventMount = true;
						console.log("Component dep event mount: " + events.join(", "));
						for (let i = 0; i < events.length; i++) {
							this.status.on(events[i], this.handelChange);
						}
					}
				}
	
				private unmountEvent() {
					if (this.status) {
						for (let i = 0; i < events.length; i++) {
							this.status.off(events[i], this.handelChange);
						}
					}
				}
	
				public render(): ReactNode {
					const Consumer = consumer;
					return <Consumer>
						{(status: C) => {
							this.status = status;
							this.mountEvent();
							return <C {...this.props} status={status}></C>;
						}}
					</Consumer>
				}
	
				public componentWillUnmount() {
					this.unmountEvent();
				}
	
			} as any;
		}
	}
}

export { superConnect };