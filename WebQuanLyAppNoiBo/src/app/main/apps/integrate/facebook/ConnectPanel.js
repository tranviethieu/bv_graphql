// import React, { useEffect, useState } from 'react';
// import { IconButton, Icon, Button, List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import axios from 'axios';
// import { showMessage } from 'app/store/actions';
// import _ from 'lodash';

// import { useDispatch, useSelector } from 'react-redux';
// import * as Actions from "../store/actions/index";

// const useStyles = makeStyles(theme => ({
//     button: {
//         margin: theme.spacing(1),
//     },
//     input: {
//         display: 'none',
//     },
// }));

// function ConnectPanel(props) {

//     const dispatch = useDispatch();
//     const classes = useStyles();
//     // const [checked, setChecked] = useState([])
//     const [user, setUser] = useState({});
//     const [pages, setPages] = useState([]);

//     const facebookSidebar = useSelector(({ integrateApp }) => integrateApp.facebook);
//     console.log("facebook Sidebar=", facebookSidebar);
//     useEffect(() => {
//         if (props.user && props.user !== null) {
//             setUser(props.user)
//             if (props.user.userID !== null && props.user.accessToken !== null) {
//                 loadPages(props.user.userID, props.user.accessToken)
//             }
//         }
//     }, [props.user]);


//     //declare function
//     function reloadPages(){
//         if (props.user.userID !== null && props.user.accessToken !== null) {
//             loadPages(props.user.userID, props.user.accessToken)
//         }
//     }
//     function loadPages(userID, accessToken) {
//         _.remove(pages)
//         setPages(pages)
//         if (userID !== null && accessToken !== null) {
//             setPages([])
//             console.log("props user userID: ", userID)
//             console.log("props user token: ", accessToken)
//             axios.get(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`).then(response => {
//                 console.log("pages data:", response.data);
//                 // setPages(response.data.data);
//                 const pages = response.data.data;
//                 if (pages) {
                     
//                      var channels = pages.map((page) => ({
//                             accessToken: page.access_token,
//                             channelId: page.id,
//                             active: true,//trạng thái true mới hiển thị trong các query sau
//                             name: page.name,
//                             image: "",
//                         }))
//                     saveIntegratedChannel(channels)

//                     pages.map((page) => {
//                         loadSubscribe(page)
//                     })
//                 }
//             })
//         }
//     }
//     function onAccountChange(page) {
//         dispatch(showMessage({ message: `Bạn đã lựa chọn theo dõi trang:${page.label}` }));
//         loadSubscribe(page);
//     }
//     function loadSubscribe(page) {
//         // pages.push(page);
//         // setPages([...pages]);
//         var urlCheck = `https://graph.facebook.com/${page.id}/subscribed_apps?access_token=${page.access_token}`;
//         axios.get(urlCheck).then(response => {
//             console.log("subscribed:", response.data.data.length);
//             if (response.data.data.length > 0) {
//                 page.checked = true;
//                 console.log("subed page: ", page.name)
//                 Actions.subcribedChannel(page.id)
//                     //hàm này cho phép subcribed 1 page
//                     .then(response => {
//                         console.log("subcribedChannel: ", response)
//                     })
//             } else {
//                 Actions.unSubcribedChannel(page.id)
//                     //hàm này cho phép unsubcribed 1 page
//                     .then(response => {
//                         console.log("subcribedChannel: ", response)
//                     })
//                 page.checked = false
//             }
//             pages.push(page);
//             setPages([...pages]);
//             // console.log("current pages:", pages);
//         })
//     }
//     function subscribePage(page) {
//         console.log(`subscribePage: token: ${page.access_token}  pageID : ${page.id}`)
//         var url = `https://graph.facebook.com/v5.0/${page.id}/subscribed_apps?subscribed_fields=feed,messages`;
//         axios.post(url, `access_token=${page.access_token}`).then(response => {
//             if (response.data && response.data.success) {
//                 dispatch(showMessage({ message: `Thiết lập theo dõi trang ${page.name} thành công` }));
//                 changePageSubcribedValue(page, true)
//             }
//         });

//     }
//     function removeSubscribe(page) {
//         var url = `https://graph.facebook.com/v5.0/${page.id}/subscribed_apps?access_token=${page.access_token}`;
//         axios.delete(url).then(response => {
//             if (response.data && response.data.success) {
//                 dispatch(showMessage({ message: `Bỏ thiết lập theo dõi trang ${page.name} thành công` }));
//                 changePageSubcribedValue(page, false)
//             }
//         });
//     }

//     // function connectPage() {
//     //     if (pages.map(e => e.checked === true).length === 0) {
//     //         dispatch(showMessage({ message: "Bạn chưa chọn trang Facebook nào" }))
//     //         return
//     //     }
//     //     var channels = []
//     //     pages.map((page) => {
//     //         if (page.checked === false) {
//     //             var tempRemove = {
//     //                 accessToken: page.access_token,
//     //                 channelId: page.id,
//     //                 active: false,
//     //                 name: page.name,
//     //                 image: "",
//     //             }
//     //             channels.push(tempRemove)
//     //             removeSubscribe(page)
//     //         } else {
//     //             var tempSub = {
//     //                 accessToken: page.access_token,
//     //                 channelId: page.id,
//     //                 active: false,
//     //                 name: page.name,
//     //                 image: "",
//     //             }
//     //             channels.push(tempSub)
//     //             subscribePage(page)
//     //         }
//     //     })
//     //     saveIntegratedChannel(channels)

//     // }
//     function saveIntegratedChannel(channels) {
//         console.log("facebooksidebar reducer: ", facebookSidebar)
//         //hàm này cho phép cập nhật trạng thái subcribed cho nhiều page lên server
//         Actions.saveIntegratedChannel(facebookSidebar.integrateId, channels)
//             .then(response => {
//                 console.log("respones: ", response)
//                 if (response && response.data) {
//                     //gửi request lên sever rồi làm gì đó tiếp
//                     console.log("save channels response: ", response)
//                 }
//             })
//     }

//     const handleToggle = value => () => {
//         if (value.checked === true) {
//             value.checked = false
//         } else {
//             value.checked = true
//         }
//         const currentIndex = pages.indexOf(value);
//         const newChecked = [...pages];
//         _.fill(newChecked, value, currentIndex, currentIndex)
//         setPages(newChecked)
//     }
//     function changePageSubcribedValue(page, value){
//         page.checked = value
//         const currentIndex = pages.indexOf(page);
//         const newChecked = [...pages];
//         _.fill(newChecked, page, currentIndex, currentIndex)
//         setPages(newChecked)
//     }

//     return (
//         <div style={{ width: "780px", height: "100%", backgroundColor: "transparent", display: "flex", marginTop: "64px", color: "#595959" }} id = "el-ConnectPanelCover">
//           <div style={{ width: "780px", height: "100%", backgroundColor: "#EBF1F4", float: "right" }}>
//             <IconButton onClick={ev => dispatch(Actions.closeFacebookConnectSidebar(1000))} color="inherit">
//               <Icon>close</Icon>
//             </IconButton>
//             <div style={{ width: "630px", height: "205px", marginLeft: "40px", marginTop: "10px", backgroundColor: "white", display: "flex", borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
//               <img style={{ width: "130px", height: "130px", objectFit: "contain", marginTop: "16px", marginLeft: "16px" }} alt="facebook" src="assets/icons/integrate/icon-facebook-large.png" />
//               <div style={{ marginLeft: "20px" }}>
//                 <Typography style={{ fontSize: "20px", marginTop: "20px" }}>
//                   Facebook được kết nối
//                 </Typography>
//                 <div style={{ backgroundColor: "#D9F6FE", borderRadius: "3px", marginTop: "45px", width: "440px", height: "65px", display: "flex" }}>
//                   {/* <Avatar style={{ marginTop: "13px", marginLeft: "20px" }} className="ml-4" src='assets/images/avatars/alice.jpg' /> */}
//                   <Avatar style={{ marginTop: "13px", marginLeft: "20px" }} className="ml-4" src={user && user.picture && user.picture.data && user.picture.data.url} />
//                   <Typography style={{ color: "#4464A2", fontSize: "16px", marginTop: "23px", marginLeft: "5px" }}>{user && user.name && user.name}</Typography>
//                   <Button style={{ marginLeft: "100px", height: "40px", marginTop: "13px" }} variant="outlined" component="span" className={classes.button} onClick={e => {
//                     dispatch(Actions.closeFacebookConnectSidebar(1000))
//                     dispatch(Actions.openFacebookLoginSidebar(1000))
//                   }}>Ngắt kết nối</Button>
//                 </div>
//               </div>
//             </div>
//             <div style={{ width: "630px", paddingBottom: "20px", marginLeft: "40px", marginTop: "20px", backgroundColor: "white", display: "inline-block", borderRadius: "3px", boxShadow: "0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19" }}>
//               <Typography style={{ fontSize: "20px", marginTop: "20px", marginLeft: "20px" }}>
//                 Vui lòng chọn trang facebook bạn muốn kết nối với el-CRM
//               </Typography>
//               <div style={{ width: "610", height: "1px", marginLeft: "20px", marginTop: "10px", borderBottom: "1px solid #979797" }}></div>
//               <List dense className={classes.root} style={{ fontSize: "18px" }}>
//                 {pages.map((page, index) => {
//                   console.log("page checked: ", page.checked)
//                   return (
//                     <ListItem key={index} button>
//                       {/* <ListItemIcon>
//                         <Checkbox
//                         edge="end"
//                         onChange={handleToggle(page)}
//                         checked={page.checked}
//                         />
//                       </ListItemIcon> */}
//                       <ListItemAvatar>
//                         <Avatar
//                           alt={`${page.name}`}
//                           src={'assets/icons/integrate/icon-facebook.png'}
//                         />
//                       </ListItemAvatar>
//                       <ListItemText style={{ fontSize: "20px", color: "#4464A2" }} id={index} primary={`${page.name}`} />
//                       <Button style={{maxWidth:"130px", minWidth:"130px", width:"130px", height:"40px"}} variant="outlined" color={page.checked===true?"primary":"secondary"} className={classes.button} onClick={e => {
//                         if(page.checked===true){
//                           //đã kết nối thì bỏ kết nối ở 2 nơi: facebook và server
//                           removeSubscribe(page)
//                           Actions.unSubcribedChannel(page.id)
//                         }else{
//                           subscribePage(page)
//                           Actions.subcribedChannel(page.id)
//                         }
//                       }}>{page.checked===true?"Ngắt kết nối":"Kết nối"}</Button>
//                     </ListItem>
//                   );
//                 })}
//               </List>
//               <div style={{ marginTop: "20px", marginLeft: "20px", display: "flex" }}>
//                 <img style={{ width: "50px", height: "50px", objectFit: "contain", }} src="assets/icons/integrate/icon-facebook-large.png" alt="icon facebook" />
//                 <Button variant="outlined" color="secondary" className={classes.button} onClick={e => reloadPages()}>
//                   Làm mới
//                 </Button>
//               </div>


//                 </div>
//             </div>
//         </div>
//     );
// }
// export default ConnectPanel;
