

export const SHOW_QUICK_DIALOG = "[DRAGABLE DIALOG] SHOW DIALOG";
export const HIDE_QUICK_DIALOG = "[DRAGABLE DIALOG] HIDE DIALOG";
export const HIDE_ALL_QUICK_DIALOG = "[DRAGABLE DIALOG] HIDE ALL DIALOG";

export function showDialog(dialog) {
    // console.log("showDialog", dialog);
    return (dispatch) => {
        dispatch({
            type: SHOW_QUICK_DIALOG,
            dialog
        })
    }
}
export function hideDialog(id) {
    return (dispatch) => dispatch({
        type: HIDE_QUICK_DIALOG,
        data:id
    })
}
export function hideAllDialog() {
    return (dispatch) => dispatch({
        type: HIDE_ALL_QUICK_DIALOG,
        data: null
    })
}
