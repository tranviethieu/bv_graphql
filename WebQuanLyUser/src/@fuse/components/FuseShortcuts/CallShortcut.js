import React, { useEffect, useRef, useState } from 'react';
import { Icon} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { FuseAnimate } from '@fuse';

const initialAnimation = "transition.bounceIn";
function CallShortcut(props) {
    const [newCall, setNewCall] = useState(false);
    const callEvents = useSelector(({ subscribe }) => subscribe.callEvents);
    const [customAnimation, setCustomAnimation] = useState(initialAnimation);
    //sử dụng interval để hiện cuộc gọi chuyển động
    const intervalRef = useRef();
    useEffect(() => {

        if (callEvents.event&&callEvents.event.state==="UP") {            
            setNewCall(true);
        }

    }, [callEvents.event]);
    useEffect(() => {
        intervalRef.current =
            setInterval(() => {
                // console.log("set interval")
                setCustomAnimation(Boolean(customAnimation) ? null : initialAnimation);
            }, 1000);
        return () => {
            // console.log("clear interval")
            clearInterval(intervalRef.current);
        };
    });

    return (
        newCall?<FuseAnimate animation={customAnimation} duration={300} delay={0}>
            <Icon className="text-blue">phone_callback</Icon>
        </FuseAnimate> :
            <Icon>call</Icon>
    )
}
export default CallShortcut;
