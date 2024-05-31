import React, {useEffect} from 'react'
import { hideAllDialog, toggleCurrentCallPanel } from 'app/store/actions';
import { useDispatch } from 'react-redux';

const CloseDragable = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
      dispatch(toggleCurrentCallPanel(false))
       dispatch(hideAllDialog());
    }, [])
    return (
      <div></div>
    )
}
export default CloseDragable;
