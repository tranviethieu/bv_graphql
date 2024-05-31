import React from 'react';
import {Icon} from "@material-ui/core";

function StatusIcon(props)
{
    switch ( props.status )
    {
        case 'UP':
            return <Icon className="block text-16 text-blue bg-white rounded-full el-StatusIcon">phone_in_talk</Icon>;
        case 'BUSY':
            return <Icon className="block text-16 text-white bg-yellow-dark rounded-full el-StatusIcon">phone_missed</Icon>;
        case 'DOWN':
            return <Icon className="block text-16 text-grey bg-white rounded-full el-StatusIcon">phone_locked</Icon>;
        case 'RING':
            return <Icon className="block text-16 text-red-dark bg-white rounded-full el-StatusIcon">phone_callback</Icon>;
        default:
            return null;
    }
}

export default StatusIcon;
