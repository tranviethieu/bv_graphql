import React from 'react';
import { Typography, Paper} from '@material-ui/core';

function Widget1(props)
{
    console.log("color:",props.color);
    return (
        <Paper className="w-full p-6 my-2 shadow-none border-1">
            <div className="text-center pb-8 pt-4">
                <Typography className="text-18">{props.widget.title}</Typography>
                {/* <IconButton aria-label="more">
                    <Icon>more_vert</Icon>
                </IconButton> */}
            </div>
            <div className="text-center pb-8">
                <Typography
                    className={"text-48 leading-none "+(props.color?props.color:"text-red")}>{props.widget.value}
                </Typography>                
            </div>            
        </Paper>
    );
}

export default React.memo(Widget1);
