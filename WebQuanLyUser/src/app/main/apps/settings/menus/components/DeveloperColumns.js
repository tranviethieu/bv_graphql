import { showQuickEditDialog, showQuickTableDialog } from '../../../shared-dialogs/actions';
import React from 'react';
import { MoreVert } from '@material-ui/icons';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {DeveloperAttributes } from './DeveloperAttributes';
import {  Menu, MenuItem } from '@material-ui/core';

export const DeveloperColumns = [
    {
        accessor: 'name',
        Header:'Tên lập trình viên'
    },
    {
        accessor: 'phoneNumber',
        Header:"Số điện thoại"
    },
    {
        accessor: 'email',
        Header:"Email"
    },
    {
        accessor: 'rank',
        Header:"Hệ số năng lực"
    }
]

export function showDeveloperTable(data,onSave) {    
    return (dispatch) => {
        const developerColumns = [
            {
                width: 30,
                accessor: '_id',
                Cell: row => <div>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <MoreVert {...bindTrigger(popupState)} />
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={() => {
                                        popupState.close();
                                        dispatch(
                                            showQuickEditDialog({
                                                rootClass: "sm:w-full md:w-1/3",
                                                title: data?"Cập nhật":"Thêm mới",
                                                submit: "Lập trình viên",
                                                data: row.original,
                                                attributes: DeveloperAttributes,
                                                submit: onSave
                                            }))
                                    }}>Sửa</MenuItem>
                                    <MenuItem onClick={popupState.close}>Xóa</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>
    
                </div>
            },
            ...DeveloperColumns
        ];
        dispatch(showQuickTableDialog({ rootClass: "sm:w-full md:w-1/2", title: "Developer", subtitle: "Danh sách lập trình viên", data, columns: developerColumns }))
    }
        
}