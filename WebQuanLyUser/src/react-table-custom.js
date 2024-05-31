import "react-table/react-table.css";
import React, { Component } from 'react';
import { FormControl, Icon, IconButton, TextField, Select } from '@material-ui/core';
import { ReactTableDefaults } from 'react-table'
// import { QUERY_DEPARTMENTS } from './app/main/apps/user-actions/store/actions/query'
// import graphqlService from 'app/services/graphqlService';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import viLocale from "date-fns/locale/vi";
import moment from "moment"
import ClearIcon from "@material-ui/icons/Clear";

// function getDepartments(variables, dispatch){
//     return graphqlService.query(QUERY_DEPARTMENTS, {variables}, dispatch);
// }

// const filterTypes = [
//     {
//         value: "contains",
//         title: "Contains"
//     }, {
//         value: "starts-with",
//         title: "Starts with"
//     }, {
//         value: "ends-with",
//         title: "Ends with"
//     }, {
//         value: "matches",
//         title: "Matches"
//     }, {
//         value: "greater-than",
//         title: "Grater than"
//     }, {
//         value: "less-than",
//         title: "Less than"
//     }
// ];
class FilterComponent extends Component {
  componentDidMount() {
    // getDepartments({}).then(response =>{
    //     this.setState({departments: response.data})
    // })
  }
  state = {
    departments: [],
    filterType: 'contains',
    filterValue: '',
    filterMenuEl: null
  };
  changeFilterType = (filterType) => {
    const newState = {
      ...this.state,
      filterType
    };
    // Update local state
    this.setState(newState);
    // Fire the callback to alert React-Table of the new filter
    this.props.onChange(newState);
    this.handleFilterMenuClose();
  };

  changeFilterValue = (event) => {
    const newState = {
      ...this.state,
      filterValue: event.target.value
    };
    // Update local state
    this.setState(newState);
    // Fire the callback to alert React-Table of the new filter
    this.props.onChange(newState.filterValue);
  };
  changeFilterValueDate = (event) => {
    const newState = {
      ...this.state,
      filterValue: moment(event).format("YYYY-MM-DD")
    };
    this.setState(newState);
    this.props.onChange(newState.filterValue);
  };
  handleResetDate = () => {
    if (this.props.column.id === "Data.AppointmentDate" || this.props.column.id === "createdTime") {
      const newState = {
        ...this.state,
        filterValue: ""
      };
      this.setState(newState);
      this.props.onChange(newState.filterValue);
    }
  };

  handleFilterMenuClick = event => {
    this.setState({ filterMenuEl: event.currentTarget });
  };

  handleFilterMenuClose = () => {
    this.setState({ filterMenuEl: null });
  };

  render() {
    const { departments } = this.state;
    return (
      <div className="filter flex flex-col">
        {
          this.props.column.id === "Data.DepartmentId" ?
            <FormControl margin="dense" variant="outlined">
              <Select
                native
                className="pr-16"
                value={this.state.filterValue}
                onChange={this.changeFilterValue}
              >
                <option value="">Tất cả</option>
                {
                  departments.map((item, index) => <option value={item.value}>{item.label}</option>)
                }
              </Select>
            </FormControl>
            : this.props.column.id === "Data.State" ?
              <FormControl margin="dense" variant="outlined">
                <Select
                  native
                  className="pr-16"
                  value={this.state.filterValue}
                  onChange={this.changeFilterValue}
                >
                  <option value="">Tất cả</option>
                  <option value={0}>Đang chờ</option>
                  <option value={1}>Đã hủy</option>
                  <option value={2}>Đã duyệt</option>
                  <option value={3}>Đã phục vụ</option>
                </Select>
              </FormControl>
              : this.props.column.id === "Data.StateTicket" ?
                <FormControl margin="dense" variant="outlined">
                  <Select
                    native
                    className="pr-16"
                    value={this.state.filterValue}
                    onChange={this.changeFilterValue}
                  >
                    <option value="">Tất cả</option>
                    <option value={0}>Chưa xử lý</option>
                    <option value={1}>Đã xử lý</option>
                  </Select>
                </FormControl>
                : this.props.column.id === "Data.Type" ?
                  <FormControl margin="dense" variant="outlined">
                    <Select
                      native
                      className="pr-16"
                      value={this.state.filterValue}
                      onChange={this.changeFilterValue}
                    >
                      <option value="">Tất cả</option>
                      <option value={0}>Tư vấn</option>
                      <option value={1}>Khiếu nại</option>
                    </Select>
                  </FormControl>
                  : this.props.column.id === "Data.Channel" ?
                    <FormControl margin="dense" variant="outlined">
                      <Select
                        native
                        className="pr-16"
                        value={this.state.filterValue}
                        onChange={this.changeFilterValue}
                      >
                        <option value="">Tất cả</option>
                        <option value={0}>CRM</option>
                        <option value={1}>APP</option>
                        <option value={2}>WEB</option>
                        <option value={3}>CALL</option>
                        <option value={4}>FBCHATBOT</option>
                        <option value={5}>FBMESSENGER</option>
                        <option value={6}>ZALOCHATBOT</option>
                      </Select>
                    </FormControl>
                    : this.props.column.id === "Data.ReExamination" ?
                      <FormControl margin="dense" variant="outlined">
                        <Select
                          native
                          className="pr-16"
                          value={this.state.filterValue}
                          onChange={this.changeFilterValue}
                        >
                          <option value="">Tất cả</option>
                          <option value={true}>Phải khám lại</option>
                          <option value={false}>Không khám lại</option>
                        </Select>
                      </FormControl>
                      : this.props.column.id === "Data.AppointmentDate" || this.props.column.id === "createdTime" ?
                        <div style={{ display: "flex" }}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                            <DatePicker
                              disableToolbar
                              variant="inline"
                              helperText={null}
                              fullWidth
                              autoOk
                              inputVariant="outlined"
                              value={this.state.filterValue ? moment(this.state.filterValue).format("YYYY-MM-DD") : new Date()}
                              onChange={this.changeFilterValueDate}
                              format="dd/MM/yyyy"
                              margin="dense"
                            />
                          </MuiPickersUtilsProvider>
                          <div style={{ paddingTop: "15px", paddingLeft: "5px" }} onClick={this.handleResetDate}>
                            <ClearIcon fontSize="inherit" />
                          </div>
                        </div>
                        :
                        <FormControl margin="dense">
                          <TextField
                            type="text"
                            variant="outlined"
                            onChange={this.changeFilterValue}
                            value={this.state.filterValue}
                            className="w-full"
                            inputProps={{ placeholder: '' }}
                          />
                        </FormControl>
        }
      </div>
    );
  }
}

const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id;
  // Pivoted rows won't contain the column.
  //  If that's the case, we set the to true (allowing us to only filter on the current column)
  const rowValue = row[id].toLowerCase();
  if (!rowValue) {
    return true;
  }

  const filterValue = filter.value.filterValue.toLowerCase() || '';
  const filterType = filter.value.filterType;

  switch (filterType) {
    case 'contains':
      return rowValue.indexOf(filterValue) > -1;
    case 'starts-with':
      return rowValue.startsWith(filterValue);
    case 'ends-with':
      return rowValue.endsWith(filterValue);
    case 'matches':
      return rowValue === filterValue;
    case 'greater-than':
      return rowValue > filterValue;
    case 'less-than':
      return rowValue < filterValue;
    default:
      return true;
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
