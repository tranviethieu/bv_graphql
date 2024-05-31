
import { toast } from 'react-toastify';
import { confirmAlert } from 'vtbase-react-confirm-alert'; // Import
import 'vtbase-react-confirm-alert/src/react-confirm-alert.css'; // Import css
//show alert
 export const showErrorToast = (message) => {
    toast.error(message, {
        type: toast.TYPE.ERROR
    })
}
export const showSuccessToast = (message) => {
    toast.success(message, {
        type: toast.TYPE.SUCCESS
    })
}

export const showAlertToast = (message) => {
    toast.warn(message, {
        type: toast.TYPE.WARNING
    })
}

//alert popup
export const showConfirmAlert = (title = "Thông báo", message = "", successTitle = "Đồng ý" , cancelTitle = "Hủy" , onSuccess = null, onCancel = null) =>{
    var arrButton = []
    if (onSuccess !== null){
        arrButton.push({
            label: successTitle === null ? "Đồng ý" : successTitle,
            type: "success",
              onClick: onSuccess,
        })
    }
    if (onCancel !== null){
        arrButton.push({
            label: cancelTitle === null ? "Hủy" : cancelTitle,
            type: "cancel",
            onClick: onCancel
        })
    }

    confirmAlert({
        title: title === null ? "Thông báo" : title,
        message: message,
        buttons: arrButton,
      })
}
