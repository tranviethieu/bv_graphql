import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import { Typography } from '@material-ui/core';
import { FuseAnimate, FuseAnimateGroup } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from "./store/actions";
import AppWidget from './Widgets/AppWidget';
import SmsConfigWidget from './Widgets/SmsConfigWidget';
import ZaloChatWidget from './Widgets/ZaloChatWidget';
import FacebookChatWidget from './Widgets/FacebookChatWidget';
import FacebookBotWidget from './Widgets/FacebookBotWidget';

function Integrate() {

    const dispatch = useDispatch();
    const integrates = useSelector(({ integrateApp }) => integrateApp.integrates);
    useEffect(() => {
        if (!integrates.data || integrates.data.length === 0) {
            dispatch(Actions.getIntegrateAccounts());
        }
    }, [dispatch, integrates.data]);

    return (
        <FusePageCarded
          classes={{
            toolbar: "p-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
          }}
          header={
            <div className="flex flex-1 w-full items-center justify-between" id ="el-IntegrateApp-header">
              <div className="flex items-center">
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography className="hidden sm:flex" variant="h6" style={{ marginRight: "10px" }}>Trung tâm tích hợp </Typography>
                </FuseAnimate>
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  <img style={{ width: "32px", height: "32px", marginLeft: "8px", objectFit: "cover" }} src='assets/icons/integrate/icon-star.png' alt="" />
                </FuseAnimate>
              </div>
            </div>
          }
          content={
            <div id = "el-IntegrateApp-content">
              <div style={{ width: "100%", height: "100%", position: "absolute" }}>
                <div style={{ width: "100%", height: "100%", position: "absolute", background: "rgba(0,0,0,0.5)", }}></div>
                <img style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} src='assets/images/integrate/integrateBG.jpeg' alt="bg" />

              </div>
              <div >

                {integrates.data && integrates.data.length > 0 ? (
                  <FuseAnimateGroup
                    enter={{
                      animation: "transition.slideUpBigIn"
                    }}
                    className="flex flex-wrap py-24"
                  >
                    {
                      integrates.data.map((item, index) => {
                        return (
                          <div style={{ width: "240px", height: "120px", marginLeft: "30px", marginTop: "30px", display: "flex", }} key={index} onClick={e => dispatch(Actions.showDrawer(item.type))}>
                            <AppWidget app={item} />
                          </div>
                        )
                      })
                    }
                  </FuseAnimateGroup>
                ) : null}

                <FacebookChatWidget />
                <FacebookBotWidget/>
                <ZaloChatWidget/>
                <SmsConfigWidget />

              </div>
            </div>
          }
        >

        </FusePageCarded>
    )
}

export default withReducer('integrateApp', reducer)(Integrate);
