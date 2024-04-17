import { PublishSubscribeEvent } from '../types/types';

class PublishSubscribe {
    subscriptions: { [key: string]: Function[] } = {};

    subscribe(eventName: PublishSubscribeEvent, callBack: Function) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].push(callBack);
        } else {
            this.subscriptions[eventName] = [callBack];
        }
    }

    sendEvent(eventName: PublishSubscribeEvent, payload?: Object) {
        this.subscriptions[eventName]?.forEach((subscribtion) => subscribtion(payload));
    }
}

export default new PublishSubscribe();
