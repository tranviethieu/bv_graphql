import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ({ options: { title, hideCancel, count,oklabel,cancellabel }, show, dismiss, message, proceed}) {
    
    const [wait,setWait] = useState(count)
    function canSubmit() {
        return !wait;
    }
    function decrease() {
        if (wait > 0) {
            setWait(wait - 1);
        }
    }
    useEffect(() => {
        if (count&&show) {
            setTimeout(decrease, 1000);
        }
    },[wait,show])

    return (
        <Dialog
            open={show}
            onClose={dismiss}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    !hideCancel&&<Button onClick={dismiss} color="primary">
                        {cancellabel||"Đóng"}
                    </Button>
                }
                <Button variant="contained" onClick={proceed} disabled={!canSubmit()} color="secondary" autoFocus>
                    {oklabel||"Đồng ý"} {wait&&(wait>0)?wait:null}
          </Button>
            </DialogActions>
        </Dialog>
    )
}
