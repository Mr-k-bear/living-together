import { Emitter, EventType } from "@Model/Emitter";
import { Component, FunctionComponent, ReactNode, Consumer } from "react";

type RenderComponent = (new (...p: any) => Component<any, any, any>) | FunctionComponent<any>;

function superConnectWithEvent<C extends Emitter<E>, E extends Record<EventType, any>>(
	consumer: Consumer<C>, keyName: string
) {
	return (...events: Array<keyof E>) => {
		return <R extends RenderComponent>(components: R): R => {
			const Components = components as any;
			const Consumer = consumer;
			return class extends Component<R> {
	
				private status: C | undefined;
				private isEventMount: boolean = false;
				private propsObject: Record<string, C> = {};
	
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
					return <Consumer>
						{(status: C) => {
							this.status = status;
							this.propsObject[keyName] = status;
							this.mountEvent();
							return <Components {...this.props} {...this.propsObject}/>;
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

function superConnect<C extends Emitter<any>>(consumer: Consumer<C>, keyName: string) {
	return <R extends RenderComponent>(components: R): R => {
		return ((props: any) => {

			const Components = components as any;
			const Consumer = consumer;

			return <Consumer>
				{(status: C) => <Components
					{...props}
					{...{[keyName]: status}}
				/>}
			</Consumer>
		}) as any;
	}
}

export { superConnectWithEvent, superConnect };