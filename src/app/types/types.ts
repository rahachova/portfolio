export enum PublishSubscribeEvent {
    Login = 'login',
    Loggedin = 'loggedin',
    Loggedout = 'loggedout',
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
    USER_LOGOUT = 'USER_LOGOUT',
    USER_ACTIVE = 'USER_ACTIVE',
}

export type User = {
    login: string;
    isLogined: boolean;
};

export type WSMessage = {
    id: string;
    type: WSMessageType;
    payload: {
        user?: User;
        users?: User[];
    };
};
