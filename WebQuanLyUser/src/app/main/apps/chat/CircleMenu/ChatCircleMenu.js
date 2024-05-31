import "./styles.css";
import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { ToggleLayer } from "react-laag";

/**
 * Icons
 */

import { Image } from "styled-icons/boxicons-regular/Image";
import { PlayCircle as Video } from "styled-icons/boxicons-regular/PlayCircle";
import { Music } from "styled-icons/boxicons-solid/Music";
import { File } from "styled-icons/boxicons-regular/File";
// import { LocationOn as Location } from "styled-icons/material/LocationOn";
// import { Code } from "styled-icons/boxicons-regular/Code";

/**
 * Components
 */

import Button from "./Button";
import Menu from "./Menu";

/**
 * Main
 */

function ChatCircleMenu(props) {
  return (
    <div id = "el-ChatCircleMenu">
      <ToggleLayer
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER"
        }}

        renderLayer={
          ({ isOpen, layerProps, close }) =>
                isOpen && (
                  <Menu
                    {...layerProps}
                    close={close}
                    items={[
                      { Icon: Image, value: "IMAGE", label: "Gửi ảnh",},
                      { Icon: Video, value: "VIDEO", label: "Gửi Video" ,},
                      { Icon: Music, value: "AUDIO", label: "Gửi file âm thanh" ,},
                      { Icon: File, value: "FILE", label: "Gửi file" , },
                      // { Icon: Location, value: "location", label: "Gửi location" , onClick:{funtion(){props.handleClick({type:"LOCATION"})}}},
                    ]}
                    onSelected={props.onSelected}
                  />
                )
        }
      >
        {({ triggerRef, toggle, isOpen }) => (
          <Button ref={triggerRef} onClick={toggle} isOpen={isOpen} />
        )}
      </ToggleLayer>
    </div>
  );
}

export default ChatCircleMenu;
