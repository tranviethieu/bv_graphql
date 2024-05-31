import React, { useState } from 'react';

import SmartGallery from 'react-smart-gallery';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { makeStyles } from '@material-ui/styles';
import './ChatCSS/chat.css';

const useStyles = makeStyles(theme => ({
  rootStyle: {
    '& img': {
      objectFit: 'cover',
    },

  },

}
))

function ImageGallery(props) {
  const classes = useStyles();
  const [openLightBox, setOpenLightBox] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const images = props.images
  return (
    <React.Fragment >
      <div className="el-ImageGallery">
        <SmartGallery
          images={images}
          onImageSelect={(event, src, index) => {
            setOpenLightBox(true)
            setPhotoIndex(index)
          }}
        // rootStyle = {{backgroundColor:"transparent", width:"",border:"none", "& img": {border:"none", objectFit:"none"}}}
        />
      </div>
      {openLightBox && <Lightbox
        mainSrc={images[photoIndex]}
        nextSrc={images[(photoIndex + 1) % images.length]}
        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
        onCloseRequest={() => setOpenLightBox(false)}
        onMovePrevRequest={() =>
          setPhotoIndex((photoIndex + images.length - 1) % images.length)
        }
        onMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % images.length)
        }
      />
      }
    </React.Fragment>
  )
}

export default ImageGallery;
