
export const SET_CALLEVENT_DATA = '[CALL EVENT] SET CALL EVENT DATA';
export const SET_SELECTED_CALL = '[CALL EVENT] SET SELECTED CALL';//xem chi tiet thong tin cuoc goi den

export function setCallEventData(data) {
    return{
        type: SET_CALLEVENT_DATA,
        data: data
    };
}

export function setSelectedCall(data) {
    return {
        type: SET_SELECTED_CALL,
        data:data
    }
}
