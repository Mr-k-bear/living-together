import { GLContextObject } from "./GLContext";
import { EventType } from "@Model/Emitter";

export abstract class GLObject3D<
    E extends Record<EventType, any> = {}
> extends GLContextObject<E> {
    
};