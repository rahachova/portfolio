export enum PublishSubscribeEvent {
    Login = 'login',
    Loggedin = 'loggedin',
    Loggedout = 'loggedout',
    Logout = 'logout',
    AboutShown = 'aboutShown',
    AboutHidden = 'aboutHidden',
    SelectInterlocutor = 'selectInterlocutor',
    StartMessageEdit = 'startMessageEdit',
    WSConnect = 'connect',
    WSDisconnect = 'disconnect',
    WSMessage = 'message',
    WSMessageReceived = 'messageReceived',
}

export enum WSMessageType {
    USER_EXTERNAL_LOGIN = 'USER_EXTERNAL_LOGIN',
    USER_EXTERNAL_LOGOUT = 'USER_EXTERNAL_LOGOUT',
    ERROR = 'ERROR',
    USER_LOGIN = 'USER_LOGIN',
    USER_LOGOUT = 'USER_LOGOUT',
    USER_ACTIVE = 'USER_ACTIVE',
    USER_INACTIVE = 'USER_INACTIVE',
    MSG_FROM_USER = 'MSG_FROM_USER',
    MSG_SEND = 'MSG_SEND',
    MSG_READ = 'MSG_READ',
    MSG_DELETE = 'MSG_DELETE',
    MSG_EDIT = 'MSG_EDIT',
    MSG_DELIVER = 'MSG_DELIVER',
}

export type User = {
    login: string;
    isLogined: boolean;
};

export type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
    };
};

export type WSPayload = {
    user?: User;
    users?: User[];
    message?: Message;
    messages?: Message[];
    error?: string;
};

export type WSMessage = {
    id: string;
    type: WSMessageType;
    payload: WSPayload;
};
