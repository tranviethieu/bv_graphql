import React from 'react';
import { Typography, Paper} from '@material-ui/core';

function Widget2(props)
{
    console.log("Widget2 props.widget.title: ",props.widget.title, " , Value: ", props.widget.value);
    return (
        <Paper className="w-full p-6 my-2 shadow-none border-1">
            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                <Typography className="text-16 truncate">{props.widget.title}</Typography>
                <Typography
                    className={"text-32 leading-none "+(props.color?props.color:"text-red")}>{props.widget.value}
                </Typography>
            </div>                    
        </Paper>
    );
}

export default React.memo(Widget2);
