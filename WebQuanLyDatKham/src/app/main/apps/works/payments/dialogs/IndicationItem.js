import React, { useState, useEffect, useMemo } from 'react';
import { Icon, Button, ButtonGroup, TextField, Divider, Typography, IconButton, List, ListItem, Avatar, ListItemText, ListItemAvatar, ListItemSecondaryAction, CardActions, CardContent, Card, CardHeader, TextareaAutosize, FormControl } from '@material-ui/core';
import * as Actions from '../actions';
import { useDispatch } from 'react-redux';
import { FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks';

export default function IndicationItem({ serviceCat, departments, data, onRemove }) {
  const dispatch = useDispatch();
  const [selectedServiceCat, setSelectedServiceCat] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { form, setForm, setInForm, handleChange } = useForm({});


  return (
    <div className="w-full">
      {
        useMemo(() => <div className="w-full px-4">
          <FuseChipSelect
            margin='dense'
            className="mt-8 mb-24"
            style={{ height: 20 }}
            value={
              selectedServiceCat
            }
            onChange={(e) => setSelectedServiceCat(e)}
            textFieldProps={{
              label: 'Loại dịch vụ',
              InputLabelProps: {
                shrink: true
              },
              variant: 'outlined'
            }}
            isClearable={true}
            options={serviceCat.map(d => ({
              value: d._id, label: d.name, ...d
            }))}
          />
        </div>, [serviceCat, selectedServiceCat])
      }
      {
        useMemo(() => <div className="w-full px-4">
          {
            selectedServiceCat && <FuseChipSelect
              margin='dense'
              className="mt-8 mb-24"
              style={{ height: 20 }}
              value={
                selectedService
              }
              onChange={(e) => setSelectedService(e)}
              textFieldProps={{
                label: 'Dịch vụ',
                InputLabelProps: {
                  shrink: true
                },
                variant: 'outlined'
              }}
              isClearable={true}
              options={selectedServiceCat.services.map(d => ({
                value: d._id, label: d.name, ...d
              }))}
            />
          }
        </div>, [selectedServiceCat, selectedService])
      }
      {
        useMemo(() => <div className="w-full px-4">
          <FuseChipSelect
            margin='dense'
            className="mt-8 mb-24"
            style={{ height: 20 }}
            value={
              selectedDepartment
            }
            onChange={(e) => setSelectedDepartment(e)}
            textFieldProps={{
              label: 'Khoa khám',
              InputLabelProps: {
                shrink: true
              },
              variant: 'outlined'
            }}
            isClearable={true}
            options={departments.map(d => ({
              value: d.code, label: d.name, ...d
            }))}
          />
        </div>, [departments, selectedDepartment])
      }
      {
        useMemo(() => <div className="w-full px-4">
          {
            selectedDepartment && <FuseChipSelect
              margin='dense'
              className="mt-8 mb-24"
              style={{ height: 20 }}
              value={
                form.clinic && {
                  value: form.clinic.code, label: form.clinic.name
                }
              }
              onChange={(e) => setInForm('clinic', e && { code: e.value, name: e.label })}
              textFieldProps={{
                label: 'Phòng khám',
                InputLabelProps: {
                  shrink: true
                },
                variant: 'outlined'
              }}
              isClearable={true}
              options={selectedDepartment.clinics.map(d => ({
                value: d.code, label: d.name, ...d
              }))}
            />
          }
        </div>, [form.clinic, selectedDepartment])
      }
      <Button variant="contained" color="secondary">Tạo chỉ định & Thanh toán</Button>
    </div>

  )
}