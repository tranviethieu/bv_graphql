import React from 'react';
import {Icon} from "@material-ui/core";

function StatusIcon(props)
{
    switch ( props.status )
    {
        case 'online':
            return <Icon className="block text-16 text-green bg-white rounded-full el-Chat-StatusIcon">check_circle</Icon>;
        case 'away':
            return <Icon className="block text-16 text-white bg-yellow-dark rounded-full el-Chat-StatusIcon">access_time</Icon>;
        case 'do-not-disturb':
            return <Icon className="block text-16 text-red bg-white rounded-full el-Chat-StatusIcon">remove_circle_outline</Icon>;
        case 'offline':
            return <Icon className="block text-16 text-grey-dark bg-white rounded-full el-Chat-StatusIcon">not_interested</Icon>;
        default:
            return null;
    }
}

export default StatusIcon;
