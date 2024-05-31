import React, {useEffect} from 'react'
import { hideAllDialog } from 'app/store/actions';
import { useDispatch } from 'react-redux';

const CloseDragable = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
       dispatch(hideAllDialog());
    }, [])
    return (
      <div></div>
    )
}
export default CloseDragable;
