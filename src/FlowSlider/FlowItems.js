import React, { useState, useEffect, useContext } from "react";
import { FlowItem } from "./FlowItem";
import { FlowContext } from "./FlowContext";

export const FlowItems = ({
  children,
  contentWidth,
  itemsPerPage,
  scaleFactor
}) => {
  // TODO
  // add disable flag

  // TODO - Can this be a HOC eg. withZoomFx

  const flowContext = useContext(FlowContext);
  const [items, setItems] = useState([]);
  const [translateAmount, setTranslateAmount] = useState(0);

  useEffect(() => {
    const itemWidthPx = contentWidth / itemsPerPage;
    setTranslateAmount((itemWidthPx * scaleFactor - itemWidthPx) / 2);
  }, [contentWidth, itemsPerPage, scaleFactor]);

  useEffect(() => {
    setItems(
      children.map(child => ({
        child,
        style: flowContext.itemBaseStyle
      }))
    );
  }, [children, flowContext]);

  const onItemMouseOver = selectedIndex => {
    setItems(old => {
      const firstItemIndex =
        Math.floor(selectedIndex / itemsPerPage) * itemsPerPage;

      const isFirstItem = current => current === firstItemIndex;
      const isLastItem = current =>
        current === firstItemIndex + itemsPerPage - 1;

      const isFirstItemSelected = () => firstItemIndex === selectedIndex;
      const isLastItemSelected = () =>
        firstItemIndex + itemsPerPage - 1 === selectedIndex;

      const isBeforeSelectedItem = current =>
        current >= firstItemIndex - 1 && current < selectedIndex;

      const isAfterSelectedItem = current =>
        current > selectedIndex && current < firstItemIndex + itemsPerPage + 1;

      const isSelectedItem = current => current === selectedIndex;

      return old.map((item, index) => {
        const style = { ...flowContext.itemBaseStyle };
        let translateX = 0;

        if (isFirstItem(index)) style.transformOrigin = "left";
        if (isLastItem(index)) style.transformOrigin = "right";

        // TODO - Set a class to all affected items eg. pre-selected selected post-selected
        if (isBeforeSelectedItem(index) && !isFirstItemSelected()) {
          translateX = isLastItemSelected()
            ? -translateAmount * 2
            : -translateAmount;
          // style.opacity = 0.7;
        } else if (isAfterSelectedItem(index) && !isLastItemSelected()) {
          translateX = isFirstItemSelected()
            ? translateAmount * 2
            : translateAmount;
          // style.opacity = 0.7;
        } else if (isSelectedItem(index)) {
          style.transform = `scale(${scaleFactor})`;
        }

        if (translateX !== 0) style.transform = `translateX(${translateX}px)`;

        return {
          ...item,
          style
        };
      });
    });
  };

  const onItemMouseOut = () =>
    setItems(items =>
      items.map(item => ({
        ...item,
        style: flowContext.itemBaseStyle
      }))
    );

  return (
    <>
      {items
        .filter(item => item.child.type === FlowItem)
        .map((item, i) => {
          return React.cloneElement(item.child, {
            onMouseOver: () => onItemMouseOver(i),
            onMouseOut: () => onItemMouseOut(),
            style: item.style
          });
        })}
    </>
  );
};
