
import React, { useEffect, useState, useMemo } from 'react';
import { ACCESS_TOKEN } from '../graphqlService/graphqlService';
import { useDispatch, useSelector } from 'react-redux';

import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks'
import { setCallEventData } from 'app/store/actions';
import { setChattingContacts } from 'app/store/actions'

const SUBCRIBE_ASTERISK = gql`
subscription Event($access_token:String!){
    asterMessage(access_token: $access_token) {
        atTime
        phoneNumber
        phoneCode
        direction
        name
        callid
        user{
            _id
            address
            avatar
            phoneNumber
            fullName
            birthDay
            createdTime
            fullName
            gender
            phoneNumber
            work{
                code
                name
            }
            email
            nationIdentification
            insuranceCode
            ward{
              name
            }
            province{
              name
            }
            district{
              name
            }
            nationality{
              name
            }
            street
        }
        account{
          base{
            fullName
            avatar
          }
        }
        state
    }
  }
`
const SUBCRIBE_CHAT = gql`
    subscription ChatEvent($bearer : String!){
        subscribeOpenChannel(bearer: $bearer){
            code
            message
            data{
                _id
                body
                {
                    text
                    attachments{
                        type
                        url
                        fileInfo{
                            _id
                            name
                            oriExtension

                        }
                    }
                }
                channel_id
                uid
                type
                createdTime
                direction
                refId
                account{
                    _id
                  base{
                    sub
                    address
                    avatar
                    birthday
                    email
                    fullName
                    gender
                    isRoot
                    mariaged
                    userName
                  }
                }
            }
        }
    }
`

export const CallEventProvider = (props) => {
    const dispatch = useDispatch();
    var access_token = localStorage.getItem(ACCESS_TOKEN);
    // console.log("subscribe with token:", access_token);
    const auth = useSelector((user) => user.auth);
    const [token, setToken] = useState("");
    const [reSubscribe, setResubscribe] = useState(true);
    useEffect(() => {
        // console.log("token: ", access_token)
        if (access_token&&auth.user && token !== access_token) {
            setToken(access_token);
            setResubscribe(true);
        } else {
            setResubscribe(false);
        }
        // console.log("resubcribe: ", reSubscribe)
    }, [auth])

    const { data, loading } = useSubscription(
        SUBCRIBE_ASTERISK,
        {
            variables: { access_token:token }, shouldResubscribe: reSubscribe,
            // onSubscriptionComplete: (e => { console.log("subscriptionComplete:", e) }),
            onSubscriptionData: (e => {
                if (e.subscriptionData.data) {
                    console.log("have subscription call:",e.subscriptionData.data)
                    dispatch(setCallEventData(e.subscriptionData.data.asterMessage))
                }
            })
        }
    );

    const { data:chatData, loading:chatLoading } = useSubscription(
        SUBCRIBE_CHAT,
        {
            variables: { bearer:token }, shouldResubscribe: reSubscribe,
            // onSubscriptionComplete: (e => { console.log("handle chatting data:", e) }),
            onSubscriptionData: (e => {
                const { response, subscribeOpenChannel } = e.subscriptionData.data;
                if (subscribeOpenChannel && subscribeOpenChannel.data)
                    dispatch(setChattingContacts(subscribeOpenChannel.data))
                // else {
                //     console.log("chat sub error:", response.message);
                //     setResubscribe(false);
                // }
            })
        }
    );

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}
// export default  Provider;
