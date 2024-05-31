import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const ACCESS_TOKEN = "access_token";

const AdvanceEditor = ({ content, onChange }) => {
  const config = {
    ckfinder: {
      // The URL that the images are uploaded to.
      uploadUrl: process.env.REACT_APP_UPLOADURL + "?type=ckeditor",

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        'X-CSRF-TOKEN': 'CSFR-Token',
        Authorization: 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
      }
    },
    // alignment: {
    //     options: [ 'left', 'right' ]
    // },
    // plugins: [ Alignment ],
    // toolbar: [
    //   'alignment'
    // ]
  }
  return (
    <div>
      <CKEditor

        editor={ClassicEditor}
        data={content}
        config={config}
        onInit={editor => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          // console.log( { event, editor, data } );
          if (onChange)
            onChange(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    </div>
  )
}
export default AdvanceEditor;