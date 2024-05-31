import * as React from "react";
import styled from "styled-components";
import Tooltip from '@material-ui/core/Tooltip';
import ResizeObserver from "resize-observer-polyfill";
import {
  ITEM_SIZE,
  RADIUS,
  BORDER,
  TEXT,
  PRIMARY,
  CONTAINER_SIZE
} from "./constants";
import { ToggleLayer, useHover } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Positioning Stuff
 */

function getTransform(progress, radius, index, totalItems) {
  const value = (index / totalItems) * progress;

  const x = radius * Math.cos(Math.PI * 2 * (value - 0.25));
  const y = radius * Math.sin(Math.PI * 2 * (value - 0.25));

  const scale = progress / 2 + 0.5;

  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/**
 * MenuItem
 */

const TooltipBox = styled(motion.div)`
  background-color: #333;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  line-height: 1.15;
  border-radius: 3px;
`;

const Circle = styled(motion.div)`
  position: absolute;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${BORDER};
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  color: ${TEXT};
  pointer-events: all;
  will-change: transform;
  z-index:999

  & svg {
    transition: 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.15);
    color: ${PRIMARY};

    & svg {
      transform: scale(1.15);
    }
  }
`;

function MenuItem({
  style,
  className,
  Icon,
  onClick,
  label,
  index,
  totalItems
}) {
  const [isOpen, bind] = useHover({ delayEnter: 300, delayLeave: 100 });

  return (
    <ToggleLayer
      className="el-Chat-Menu"
      ResizeObserver={ResizeObserver}
      isOpen={isOpen}
      fixed
      placement={{
        anchor: "TOP_CENTER",
        autoAdjust: true,
        scrollOffset: 16,
        triggerOffset: 6
      }}
      renderLayer={({ isOpen, layerProps }) => {
        return (
          <AnimatePresence className="el-Chat-AnimatePresence">
            {isOpen && (
              <TooltipBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...layerProps}
              >
                {label}
              </TooltipBox>
            )}
          </AnimatePresence>
        );
      }}
    >
      {({ triggerRef }) => (
        <Tooltip title={label}>
          <Circle
            ref={triggerRef}
            className={className}
            style={style}
            onClick={onClick}
            {...bind}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            transformTemplate={({ x }) => {
              const value = parseFloat(x.replace("px", ""));
              return getTransform(value, RADIUS, index, totalItems);
            }}
            transition={{
              delay: index * 0.025,
              type: "spring",
              stiffness: 600,
              damping: 50,
              mass: 1
            }}
          >
            {React.createElement(Icon, { size: 20 })}
          </Circle>
        </Tooltip>
      )}
    </ToggleLayer>
  );
}

/**
 * Menu
 */

const MenuBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CONTAINER_SIZE}px;
  height: ${CONTAINER_SIZE}px;
  pointer-events: none;
  border-radius: 50%;
`;

const Menu = React.forwardRef(function Menu({ style, close, items, onSelected }, ref) {
  return (
    <MenuBase ref={ref} style={style} onClick={close}>
      {items.map((item, index) => (
        // <Tooltip title={item.label}>
        <MenuItem
          key={index}
          Icon={item.Icon}
          label={item.label}
          // onClick={item.onSelected}
          // onClick = {e => console.log(" selected: ",item.value)}
          onClick={e => onSelected(item.value)}
          index={index}
          totalItems={items.length}
        />
        // </Tooltip>
      ))}
    </MenuBase>
  );
});

export default Menu;
