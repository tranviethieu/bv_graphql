//ham nay chuyen xu ly loi
import confirm from 'components/Confirmation'
const authCheck=(data)=>{
    // console.log(data);
    
    if(!data) return;
    if(data.data)
        data=data.data;
    if(data.response)
        data=data.response;
    if(!data.code)
        return true;
    if(data.code==2){        
        window.location.href='/login';
    }else if(data.code!=0){
        confirm(data.message,{hideCancel:true,title:""});
        return false;
    }else
    return true;
}
export default authCheck