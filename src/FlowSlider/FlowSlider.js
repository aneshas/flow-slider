import React, { useEffect, useRef, useReducer, useState } from "react";
import { FlowItems } from "./FlowItems";
import { FlowPrev, FlowNext } from "./FlowControls";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { FlowContext } from "./FlowContext";
import { FlowState } from "./FlowState";
import { flowReducer } from "./reducers";
import { useElementWidth } from "./hooks";

export const FlowSlider = ({
  title,
  threshold = 0,
  loadMore = () => {},
  hasMore = true,
  loaderItem = "loading...",
  itemsPerPage = 2,
  gutter = 2,
  scaleFactor = 1.4,
  children = []
}) => {
  const ref = useRef();
  // TODO - Set animations, delays, number of items etc...
  // through theming eg. just provide theme (a css class)
  const [state, dispatch] = useReducer(flowReducer, {
    current: FlowState.FETCHING,
    itemsOffset: 0,
    contentWidth: 0,
    threshold: threshold
  });

  const [contentWidth, contentRef] = useElementWidth();

  useEffect(() => {
    dispatch({
      type: "CONTENT_RESIZED",
      contentWidth
    });
  }, [contentWidth]);

  useEffect(() => {
    dispatch({
      type: "BATCH_LOADED"
    });
  }, [children]);

  useEffect(() => {
    if (state.current !== FlowState.NEED_MORE) return;

    dispatch({
      type: "CONTENT_REQUESTED"
    });

    loadMore();
  }, [state, loadMore]);

  useEffect(() => {
    if (!hasMore) {
      dispatch({
        type: "COMPLETE"
      });
    }
  }, [hasMore]);

  const [flowContext, setFlowContext] = useState({
    itemBaseStyle: {
      transform: "scale(1.0) translateX(0px)",
      zIndex: 1
    }
  });

  useEffect(() => {
    const itemWidth = 100 / itemsPerPage;

    setFlowContext({
      itemBaseStyle: {
        flexBasis: `${itemWidth}%`,
        padding: `0 ${gutter}px 0 ${gutter}px`,
        transformOrigin: "center"
      }
    });
  }, [itemsPerPage, gutter]);

  const prev = () =>
    dispatch({
      type: "MOVE_PREV",
      itemsWidth: ref.current.scrollWidth
    });

  const next = () =>
    dispatch({
      type: "MOVE_NEXT",
      itemsWidth: ref.current.scrollWidth
    });

  return (
    <FlowContext.Provider value={flowContext}>
      <div className="flowSlider">
        <div className="flowTitle">{title}</div>
        <div className="flowContent" ref={contentRef}>
          {state.itemsOffset < 0 && <FlowPrev clicked={() => prev()} />}
          {true && <FlowNext clicked={() => next()} />}
          <div
            ref={ref}
            className="flowItems"
            style={{
              transform: `translateX(${state.itemsOffset}px)`
            }}
          >
            <FlowItems
              scaleFactor={scaleFactor}
              contentWidth={contentWidth}
              itemsPerPage={itemsPerPage}
            >
              {children}
            </FlowItems>
            {state.current === FlowState.FETCHING && (
              <LoadingPlaceholder>{loaderItem}</LoadingPlaceholder>
            )}
          </div>
        </div>
      </div>
    </FlowContext.Provider>
  );
};
