import PublishSubscribeEvents from '../types/publishSubscribeEvents';

class PublishSubscribe {
    subscriptions: { [key: string]: Function[] } = {};

    subscribe(eventName: PublishSubscribeEvents, callBack: Function) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].push(callBack);
        } else {
            this.subscriptions[eventName] = [callBack];
        }
    }

    sendEvent(eventName: PublishSubscribeEvents, payload?: Object) {
        this.subscriptions[eventName]?.forEach((subscribtion) => subscribtion(payload));
    }
}

export default new PublishSubscribe();
