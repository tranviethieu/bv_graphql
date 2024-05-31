import React, { useCallback } from 'react';
import { List } from '@material-ui/core';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import PollListItem from './PollListItem'
import PollAddListItem from './PollAddListItem'

function PollList(props) {
    const { onPollsChange, polls, type } = props;
    const { form, setInForm, setForm } = useForm(polls);

    useUpdateEffect(() => {
        onPollsChange(form)
    }, [form, onPollsChange]);

    const handleListItemChange = useCallback((item, index) => {
        setInForm(`[${index}]`, item)
    }, [setInForm]);

    function handleListItemRemove(index) {
        polls.splice(index, 1);
        onPollsChange(polls)
    }
    function handleListItemAdd(item) {
        setForm([...polls, item])
    }
    return (
      <List className = "el-PollList">
        {
          props.polls && props.polls.map((poll, index) =>
            <React.Fragment key={index}>
              <PollListItem type={type} onListItemChange={handleListItemChange} index={index} onListItemRemove={handleListItemRemove} poll={poll} />
            </React.Fragment>
          )
        }
        <PollAddListItem type={type} onListItemAdd={(item) => handleListItemAdd(item)} />
      </List>
    )
}
export default PollList;
