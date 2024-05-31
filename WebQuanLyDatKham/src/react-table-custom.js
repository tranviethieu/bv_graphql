import "react-table/react-table.css";
import React, {Component} from 'react';
import {FormControl, Icon, IconButton, TextField, Select, Switch} from '@material-ui/core';
import ReactTable, { ReactTableDefaults } from 'react-table'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from "moment"
import ClearIcon from "@material-ui/icons/Clear";
export default function (props) {

  //overide lai ham nay
  const onFetchData = (state) => {
    const { filtered } = state;
    // console.log("ori filter:", filtered);
    const modifiedFilter = filtered.map(item => ({ id: item.id, ...item.value }))
    // console.log("modified filtered:", modifiedFilter);
    if (props.onFetchData) {
      props.onFetchData({ ...state, filtered: modifiedFilter })
    }
  }
  return (
    <ReactTable {...props} onFetchData={onFetchData} />
  )
}

class FilterComponent extends Component {
  componentDidMount() {

  }
  state = {
    operation: '',
    value: '',
    // filterMenuEl: null
  };
  changeoperation = (operation) => {
    const newState = {
      ...this.state,
      operation
    };
    // Update local state
    this.setState(newState);
    // Fire the callback to alert React-Table of the new filter
    this.props.onChange(newState);
    // this.handleFilterMenuClose();
  };

  changeFilterValue = (event) => {

    const newState = {
      ...this.state,
      value: event.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')
    };
    // Update local state
    this.setState(newState);
    // Fire the callback to alert React-Table of the new filter
    if (this.props.onChange)
      this.props.onChange(newState);
  };
  changeFilterCheckValue = (event) => {
    const newState = {
      ...this.state,
      value: event.target.checked ? 'true' : 'false'
    };
    // Update local state
    this.setState(newState);
    // Fire the callback to alert React-Table of the new filter
    if (this.props.onChange)
      this.props.onChange(newState);
  }
  changeFilterValueDate = (event) => {
    const newState = {
      ...this.state,
      value: moment(event).format("YYYY-MM-DD")
    };
    this.setState(newState);
    if (this.props.onChange)
      this.props.onChange(newState);
  };
  handleResetDate = () => {
    if (this.props.column.id === "Data.AppointmentDate" || this.props.column.id === "createdTime") {
      const newState = {
        ...this.state,
        value: ""
      };
      this.setState(newState);
      if (this.props.onChange)
        this.props.onChange(newState);
    }
  };

  // handleFilterMenuClick = event => {
  //     this.setState({ filterMenuEl: event.currentTarget });
  // };

  // handleFilterMenuClose = () => {
  //     this.setState({ filterMenuEl: null });
  // };

  renderSelectFilter = () =>
    <FormControl margin="dense" variant="outlined" className="table-filter">
      <Select
        native
        className="pr-16"
        value={this.state.value}
        onChange={this.changeFilterValue}
      >
        <option value="">Tất cả</option>
        {
          this.props.column.options.map((item, index) => <option value={item.value}>{item.label}</option>)
        }
      </Select>
    </FormControl>

  renderDateFilter = () =>
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
        <DatePicker
          disableToolbar
          variant="inline"
          helperText={null}
          fullWidth
          autoOk
          inputVariant="outlined"
          value={this.state.value ? moment(this.state.value).format("YYYY-MM-DD") : new Date()}
          onChange={this.changeFilterValueDate}
          format="dd/MM/yyyy"
          margin="dense"
        />
      </MuiPickersUtilsProvider>
      <div style={{ paddingTop: "15px", paddingLeft: "5px" }} onClick={this.handleResetDate}>
        <ClearIcon fontSize="inherit" />
      </div>
    </div>
  renderSwitchFilter = () =>
    <div style={{ display: "flex" }}>
      <Switch
        checked={this.state.value === "true"} onChange={this.changeFilterCheckValue}
      />
    </div>

  renderTextFilter = () =>
    <FormControl margin="dense">
      <TextField
        type="text"
        variant="outlined"
        onChange={this.changeFilterValue}
        value={this.state.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ,-/.\s]/gi, '')}
        className="w-full"
        inputProps={{ placeholder: '' }}
      />
    </FormControl>


  render() {
    return (
      <div className="filter flex flex-col">
        {
          this.props.column.type ? (
            this.props.column.type === "select" && this.props.column.options ?
              this.renderSelectFilter() :
              this.props.column.type === "date" ?
                this.renderDateFilter() :
                this.props.column.type === "switch" ?
                  this.renderSwitchFilter() :
                  this.renderTextFilter()
          ) : this.renderTextFilter()
        }
      </div>
    );
  }
}

const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id;

  // console.log("filter=", filter);
  // Pivoted rows won't contain the column.
  //  If that's the case, we set the to true (allowing us to only filter on the current column)

  let rowValue = row[id];
  if (rowValue === undefined) {
    // return false;
    rowValue = '';
  }
  rowValue = rowValue.toString().toLowerCase();
  const operation = filter.value.operation;
  const value = filter.value.value.toLowerCase() || '';
  // console.log("value=", value,"rowvalue=",rowValue);
  switch (operation) {

    case '>=':
      return rowValue > value;
    case '<=':
      return rowValue < value;
    case '==':
      return rowValue === value;
      case '':
    default:
      return rowValue.indexOf(value) > -1;
  }
};

/**
 * React Table Defaults
 */
Object.assign(ReactTableDefaults, {
  PreviousComponent: (props) => (
    <IconButton {...props}>
      <Icon>chevron_left</Icon>
    </IconButton>
  ),
  NextComponent: (props) => (
    <IconButton {...props}>
      <Icon>chevron_right</Icon>
    </IconButton>
  ),
  FilterComponent: (props) => (
    <FilterComponent {...props} />
  ),
  defaultFilterMethod
});

// function getDepartments(variables, dispatch){
//     return graphqlService.query(QUERY_DEPARTMENTS, {variables}, dispatch);
// }
// class FilterComponent extends Component {
//
//     componentDidMount(){
//         getDepartments({}).then(response =>{
//           this.setState({departments: response.data})
//         })
//     }
//     state = {
//         departments: [],
//         filterType  : 'contains',
//         filterValue : '',
//         filterMenuEl: null
//     };
//     changeFilterType = (filterType) => {
//         const newState = {
//             ...this.state,
//             filterType
//         };
//         // Update local state
//         this.setState(newState);
//         // Fire the callback to alert React-Table of the new filter
//         this.props.onChange(newState);
//         this.handleFilterMenuClose();
//     };
//
//     changeFilterValue = (event) => {
//         const newState = {
//             ...this.state,
//             filterValue: event.target.value.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')
//         };
//         // Update local state
//         this.setState(newState);
//         // Fire the callback to alert React-Table of the new filter
//         this.props.onChange(newState.filterValue);
//     };
//     changeFilterValueDate = (event) => {
//         const newState = {
//             ...this.state,
//             filterValue: moment(event).format("YYYY-MM-DD")
//         };
//         this.setState(newState);
//         this.props.onChange(newState.filterValue);
//     };
//     handleResetDate = () => {
//         if(this.props.column.id === "Data.AppointmentDate" || this.props.column.id === "createdTime"){
//             const newState = {
//                 ...this.state,
//                 filterValue: ""
//             };
//             this.setState(newState);
//             this.props.onChange(newState.filterValue);
//         }
//     };
//
//     handleFilterMenuClick = event => {
//         this.setState({filterMenuEl: event.currentTarget});
//     };
//
//     handleFilterMenuClose = () => {
//         this.setState({filterMenuEl: null});
//     };
//
//     render()
//     {
//         const {departments} = this.state;
//         return (
//             <div className="filter flex flex-col" id = "el-filterCustom">
//               {
//                 this.props.column.id === "Data.DepartmentId"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       {
//                         departments.map((item, index)=><option value = {item.value}>{item.label}</option>)
//                       }
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.State"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = {0}>Đang chờ</option>
//                       <option value = {1}>Đã hủy</option>
//                       <option value = {2}>Đã duyệt</option>
//                       <option value = {3}>Đã đến khám</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.StateTicket"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = {0}>Chưa xử lý</option>
//                       <option value = {1}>Đã xử lý</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.Type"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = {0}>Tư vấn</option>
//                       <option value = {1}>Khiếu nại</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.Channel"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = {0}>CRM</option>
//                       <option value = {1}>Ứng dụng</option>
//                       <option value = {2}>Website</option>
//                       <option value = {3}>Điện thoại</option>
//                       <option value = {4}>FacebookBot</option>
//                       <option value = {5}>FacebookChat</option>
//                       <option value = {6}>ZaloBot</option>
//                       <option value = {7}>ZaloChat</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "state"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = "ACTIVE">Hiện hoạt</option>
//                       <option value = "DISABLE">Vô hiệu</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "action"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = "APPOINTMENT">Đặt lịch khám</option>
//                       <option value = "EXAMINATION">Kết quả khám</option>
//                       <option value = "TESTRESULT">Kết quả xét nghiệm</option>
//                       <option value = "SCANRESULT">Kết quả chụp chiếu</option>
//                       <option value = "PRESCRIPTION">Đơn thuốc</option>
//                       <option value = "TICKET">Yêu cầu khách hàng</option>
//                       <option value = "SURVEY">Thực hiện khảo sát</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.ReExamination"?
//                   <FormControl margin ="dense" variant="outlined" className = "el-filterSelect">
//                     <Select
//                       native
//                       className="pr-16"
//                       value={this.state.filterValue}
//                       onChange={this.changeFilterValue}
//                     >
//                       <option value ="">Tất cả</option>
//                       <option value = {true}>Phải khám lại</option>
//                       <option value = {false}>Không khám lại</option>
//                     </Select>
//                   </FormControl>
//                 :this.props.column.id === "Data.AppointmentDate" || this.props.column.id === "createdTime"?
//                   <div className = "el-filterDateSelect">
//                     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale} id = "el-filterDatePicker-cover">
//                       <DatePicker
//                         id = "el-filterDatePicker"
//                         disableToolbar
//                         variant="inline"
//                         helperText={null}
//                         fullWidth
//                         autoOk
//                         inputVariant="outlined"
//                         value={this.state.filterValue? moment(this.state.filterValue).format("YYYY-MM-DD"): new Date()}
//                         onChange={this.changeFilterValueDate}
//                         format="dd/MM/yyyy"
//                         margin="dense"
//                       />
//                     </MuiPickersUtilsProvider>
//                     <div id = "el-resetDateFilter" onClick = {this.handleResetDate}>
//                       <ClearIcon fontSize="inherit"/>
//                     </div>
//                   </div>
//                 :
//                 <FormControl margin ="dense" className = "el-filterTextField">
//                   <TextField
//                     type="text"
//                     variant="outlined"
//                     onChange={this.changeFilterValue}
//                     value={this.state.filterValue.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '')}
//                     className="w-full"
//                     inputProps={{placeholder: ''}}
//                   />
//                 </FormControl>
//               }
//             </div>
//         );
//     }
// }
//
// const defaultFilterMethod = (filter, row) => {
//     const id = filter.pivotId || filter.id;
//     // Pivoted rows won't contain the column.
//     //  If that's the case, we set the to true (allowing us to only filter on the current column)
//     const rowValue = row[id].toLowerCase();
//     if ( !rowValue )
//     {
//         return true;
//     }
//
//     const filterValue = filter.value.filterValue.toLowerCase() || '';
//     const filterType = filter.value.filterType;
//
//     switch ( filterType )
//     {
//         case 'contains':
//             return rowValue.indexOf(filterValue) > -1;
//         case 'starts-with':
//             return rowValue.startsWith(filterValue);
//         case 'ends-with':
//             return rowValue.endsWith(filterValue);
//         case 'matches':
//             return rowValue === filterValue;
//         case 'greater-than':
//             return rowValue > filterValue;
//         case 'less-than':
//             return rowValue < filterValue;
//         default:
//             return true;
//     }
// };
//
// /**
//  * React Table Defaults
//  */
// Object.assign(ReactTableDefaults, {
//     PreviousComponent: (props) => (
//         <IconButton {...props}>
//           <Icon>chevron_left</Icon>
//         </IconButton>
//     ),
//     NextComponent    : (props) => (
//         <IconButton {...props}>
//           <Icon>chevron_right</Icon>
//         </IconButton>
//     ),
//     FilterComponent  : (props) => (
//         <FilterComponent {...props} />
//     ),
//     defaultFilterMethod
// });
