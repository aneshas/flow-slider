import React, { useEffect, useRef, useReducer, useState } from "react";
import { FlowItems } from "./FlowItems";
import { FlowPrev, FlowNext } from "./FlowControls";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { FlowContext } from "./FlowContext";

// import { FlowState } from "./flow-state";
// import { flowReducer } from "./flow-reducer";

const FlowState = Object.freeze({
  NEED_MORE: "need_more",
  FETCHING: "fetching",
  IDLE: "idle",
  COMPLETED: "completed"
});

const flowReducer = (state, action) => {
  const checkThreshold = (itemsWidth, itemsOffset) => {
    if (
      state.current === FlowState.COMPLETED ||
      state.current === FlowState.FETCHING
    )
      return state;

    const x = Math.abs(itemsOffset) + state.contentWidth;

    if (itemsWidth - x < state.contentWidth + state.threshold) {
      console.log("time to load more");

      return {
        ...state,
        current: FlowState.NEED_MORE
      };
    }

    return state;
  };

  const move = (itemsWidth, nextOffset) => ({
    ...checkThreshold(itemsWidth, nextOffset),
    itemsOffset: nextOffset
  });

  switch (action.type) {
    case "CONTENT_RESIZED":
      return {
        ...state,
        contentWidth: action.contentWidth
      };

    case "CONTENT_REQUESTED":
      if (state.current !== FlowState.NEED_MORE) return state;

      return {
        ...state,
        current: FlowState.FETCHING
      };

    case "BATCH_LOADED":
      return {
        ...state,
        current: FlowState.IDLE
      };

    case "COMPLETE":
      return {
        ...state,
        current: FlowState.COMPLETED
      };

    case "MOVE_NEXT":
      const newOffset = state.itemsOffset - state.contentWidth;
      const nextOffset =
        Math.abs(newOffset) >= action.itemsWidth
          ? state.itemsOffset
          : newOffset;

      return move(action.itemsWidth, nextOffset);

    case "MOVE_PREV":
      const offset = state.itemsOffset + state.contentWidth;
      const prevOffset = offset >= 0 ? 0 : offset;

      return move(action.itemsWidth, prevOffset);

    default:
      return state;
  }
};

export const FlowSlider = ({
  title,
  threshold = 0,
  loadMore = () => {},
  hasMore = true,
  loaderItem = "loading...",
  itemsPerPage = 2,
  gutter = 2,
  scaleFactor = 1.5,
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

  const [contentWidth, contentRef] = useContentWidth();

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

const useContentWidth = () => {
  const [width, setWidth] = useState(0);

  const ref = useRef();

  useEffect(() => {
    const setContanerWidth = () => setWidth(ref.current.offsetWidth);

    setContanerWidth();

    window.addEventListener("resize", setContanerWidth);

    return () => window.removeEventListener("resize", setContanerWidth);
  }, [ref]);

  return [width, ref];
};
