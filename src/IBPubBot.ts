// @ts-check
import { EventEmitter } from "events";

interface IBPubBotEventData {
    speech?: string;
}

declare interface IBPubBotEvent {
    emit(event: string, eventData: IBPubBotEventData): boolean;
    emit(event: "ready"): boolean;
    emit(event: "introduce"): boolean;
    on(event: string, listener: (eventData: IBPubBotEventData) => void): this;
    on(event: "ready"): this;
    on(event: "introduce"): this;
}
class IBPubBotEvent extends EventEmitter {}

export class IBPubBot {

    public readonly name: string;
    public events: IBPubBotEvent;

    constructor ( name: string ) {
        this.name = name;
        this.events = new IBPubBotEvent();
        this.events.emit("ready",{});
    }

    public run (): void {
        this.introduce();
    }

    private introduce (): void {
        let speechText = "G'Day!, my name is " + this.name;
        let eventData: IBPubBotEventData = {
            "speech": speechText
        }
        this.events.emit("introduce", eventData);        
    }

    private getOrderIntent (): void {

    }

    private getUsersName (): void {

    }

}

export default IBPubBot;
