import React, { useCallback} from 'react';
import { List } from '@material-ui/core';
import {useForm, useUpdateEffect} from '@fuse/hooks';
import PollSmileyItem from './PollSmileyItem'
import PollSmileyAdd from './PollSmileyAdd';

function PollSmileyList(props) {
    const { onPollsChange, polls } = props;
    const { form, setInForm, setForm } = useForm(polls);

    useUpdateEffect(() => {

        onPollsChange(form);
    }, [form, onPollsChange]);


    const handleListItemChange = useCallback((item, index) => {
        console.log("listItemChange:",index, item);
        setInForm(`[${index}]`, item);
    }, [setInForm]);

    function handleListItemRemove(index)
    {
        polls.splice(index, 1);
        setInForm('polls', polls);
    }
    function handleListItemAdd(item)
    {
        // setInForm('polls', [...polls, item]);
        setForm([...polls,item])
    }
    return (
        <List className = "el-PollSmileyList">
          {
            props.polls && props.polls.map((poll, index) =>
              <React.Fragment key={index}>
                <PollSmileyItem onListItemChange={handleListItemChange} index={index} onListItemRemove={handleListItemRemove} poll={poll}/>
              </React.Fragment>
            )
          }
          <PollSmileyAdd onListItemAdd={(item) => handleListItemAdd(item)}/>
        </List>
    )
}
export default PollSmileyList;
