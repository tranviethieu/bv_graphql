import React from "react";
import { showDialog, hideDialog } from "app/store/actions";
import { IndicationDialog } from "./IndicationList";

export function showIndicationListDialog({ sessionProp, onClose }) {
  return (dispatch) => {
    const dialog = {
      children: <IndicationDialog sessionProp={sessionProp} onClose={onClose} />,
      id: "indication-dialog",
      rootClass: "w-1/4"
    };
    dispatch(showDialog(dialog));
  };
}

export function hideIndicationListDialog() {
  return (dispatch) => dispatch(hideDialog("indication-dialog"));
}
