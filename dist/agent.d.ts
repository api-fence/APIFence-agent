import { APIFenceConfig, APIFenceEvent } from "./types";
export declare class APIFenceAgent {
    private static config;
    private static queue;
    private static timer;
    static init(config: APIFenceConfig): void;
    static addEvent(event: APIFenceEvent): void;
    private static transformEvent;
    private static startQueue;
}
