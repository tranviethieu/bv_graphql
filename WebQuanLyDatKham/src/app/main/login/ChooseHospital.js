import React, { useState, useEffect } from 'react'
import { Card, CardContent, Button, Icon, Typography } from '@material-ui/core';
import { FuseAnimate, FuseChipSelect } from '@fuse';
import history from '@history'
import * as authActions from 'app/auth/store/actions';
import elsagaService from 'app/services/elsagaService';
import moment from 'moment'
const listHospital = [
  { value: "bvdktpt", label: process.env.REACT_APP_HOSPITAL }
]
export default function ChooseHospital(props) {
  useEffect(()=>{
    elsagaService.logout()
  }, [])
  const [domain, setDomain] = useState(null)
  return (
    <React.Fragment>
      <Card className="custom-choose-hospital">
        <CardContent className="flex flex-col items-center ">
          <img className="w-96 mb-32 el-LoginFormImage" src="assets/images/logos/elsaga.png" alt="logo" />
          <Typography variant="h6" className="text-center md:w-full mb-48 el-LoginFormTitle">Chuyển hướng đến trang CRM Bệnh viện qua tên miền</Typography>
          <FuseChipSelect
            className = "w-full"
            value = {domain ? domain : null}
            onChange = {e => setDomain(e)}
            textFieldProps={{
              label: 'Chọn bệnh viện',
              InputLabelProps: {
                shrink: true
              },
              variant: 'outlined'
            }}
            options = {listHospital}
          />
          <Button
            className = "mt-16"
            variant="contained"
            color="primary"
            onClick = {()=>history.push('/login')}
            disabled = {!domain}
            endIcon={<Icon>arrow_forward</Icon>}
          >
            Chuyển tới CRM
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
