export enum PublishSubscribeEvent {
    Login = 'login',
    Loggedin = 'loggedin',
    Logout = 'logout',
    WSConnect = 'connect',
    WSDisconnect = 'disconnect',
    WSMessage = 'message',
    WSMessageReceived = 'messageReceived',
}

export enum WSMessageType {
    USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
    ERROR = 'ERROR',
    USER_LOGIN = 'USER_LOGIN',
}

export type WSMessage = {
    id: string;
    type: WSMessageType;
    payload: {
        user?: {
            login: string;
            isLogined: boolean;
        };
    };
};
