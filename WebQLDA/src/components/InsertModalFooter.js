import React from 'react';
import {Button,ButtonGroup} from 'reactstrap'


const InsertModalFooter =({className,saveBtnText,closeBtnText,closeBtnContextual,saveBtnContextual,closeBtnClass,saveBtnClass,beforeClose,beforeSave,onModalClose,onSave})=>{   
    return(
        <ButtonGroup className={className}>
            <Button className={saveBtnClass} onClick={onSave}>
                {saveBtnText}
            </Button>
            <Button className={closeBtnClass} onClick={onModalClose}>
                {closeBtnText}
            </Button>
        </ButtonGroup>

    )
}


export default InsertModalFooter;