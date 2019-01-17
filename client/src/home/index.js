export const homeActionTypes = {
    CLEAR_CHANNEL_NOTIFICATIONS: "talkpeach/home/CLEAR_CHANNEL_NOTIFICATIONS",
    CLEAR_PRIVATE_CHAT_NOTIFICATIONS: "talkpeach/home/CLEAR_PRIVATE_CHAT_NOTIFICATIONS",
    NEW_CHANNEL_NOTIFICATION: "talkpeach/home/NEW_CHANNEL_NOTIFICATION",
    NEW_PRIVATE_CHAT_NOTIFICATION: "talkpeach/home/NEW_PRIVATE_CHAT_NOTIFICATION"
}

export const actions = {
    clearChannelNotifications,
    clearPrivateChatNotifications,
    newChannelNotification,
    newPrivateChatNotification
}

function clearChannelNotifications(channelId) {
    return {
        type: homeActionTypes.CLEAR_CHANNEL_NOTIFICATIONS,
        channelId
    }
}

function clearPrivateChatNotifications(userId) {
    return {
        type: homeActionTypes.CLEAR_PRIVATE_CHAT_NOTIFICATIONS,
        userId
    }
}

function newChannelNotification(channelId) {
    return {
        type: homeActionTypes.NEW_CHANNEL_NOTIFICATION,
        channelId
    }
}

function newPrivateChatNotification(userId) {
    return {
        type: homeActionTypes.NEW_PRIVATE_CHAT_NOTIFICATION,
        userId
    }
}

const initialState = {
    notifications: {
        channels: {

        },
        private: {

        }
    }
}

export default function home(state = initialState, action) {
    switch (action.type) {
        case homeActionTypes.CLEAR_PRIVATE_CHAT_NOTIFICATIONS:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    private: {
                        ...state.notifications.private,
                        [action.userId]: 0
                    }
                }
            }
        case homeActionTypes.CLEAR_CHANNEL_NOTIFICATIONS:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    channels: {
                        ...state.notifications.channels,
                        [action.channelId]: 0
                    }
                }
            }
        case homeActionTypes.NEW_CHANNEL_NOTIFICATION:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    channels: {
                        ...state.notifications.channels,
                        [action.channelId]: (state.notifications.channels[action.channelId] || 0) + 1
                    }
                }
            }
        case homeActionTypes.NEW_PRIVATE_CHAT_NOTIFICATION:
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    private: {
                        ...state.notifications.private,
                        [action.userId]: (state.notifications.private[action.userId] || 0) + 1
                    }
                }
            }
        default:
            return state;
    }
}