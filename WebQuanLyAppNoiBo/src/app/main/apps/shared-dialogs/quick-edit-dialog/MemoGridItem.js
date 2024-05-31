import React, { useMemo } from 'react';


export default function MemoGridItem(props) {
    return
    useMemo(() => <div>{props.name}</div>,[props.name]);
}