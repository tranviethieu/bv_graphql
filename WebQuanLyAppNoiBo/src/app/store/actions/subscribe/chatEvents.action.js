
export const SET_CHATTING_CONTACTS = '[CHAT EVENT] SET CHATTING CONTACT'; // set mảng contact đã chat trong hộp thư đến

export function setChattingContacts(data) {
    console.log("===> chat handle data: ", data)
    return{
        type: SET_CHATTING_CONTACTS,
        data: data
    };
}   