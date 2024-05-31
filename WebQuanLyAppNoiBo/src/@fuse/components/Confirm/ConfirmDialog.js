import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ({ title, open, onClose, message, onSubmit, count }) {
    
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
        if (count&&open) {
            console.log("have count time:", wait);
            setTimeout(decrease, 1000);
        }
    },[wait,open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
                {
                    onSubmit&&<Button onClick={onSubmit} disabled={!canSubmit()} color="primary" autoFocus>
                        Đồng ý {wait && (wait > 0) ? wait : null}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    )
}
