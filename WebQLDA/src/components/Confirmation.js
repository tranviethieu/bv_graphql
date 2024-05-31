import React,{useState,useEffect} from 'react';
import { confirmable } from 'react-confirm';
import { createConfirmation } from 'react-confirm';

import ConfirmDialog from './Widget/ConfirmDialog';

const confirm = createConfirmation(confirmable(ConfirmDialog));
export default function(message, options = {}) {
// You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ message, options });
}
// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
//export default confirmable(Confirmation);