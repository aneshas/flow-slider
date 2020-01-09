import React, { useState } from "react";
import ReactDOM from "react-dom";
import FlowSlider, { FlowItem } from "./FlowSlider";

import "./styles.css";
import "./FlowSlider/default-theme.css";
import "./custom-theme.css";

function App() {
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13
  ]);

  const loadMore = () => {
    setTimeout(() => {
      console.log("loading more");
      setItems(oldItems => {
        const newItems = [];
        for (let i = oldItems.length + 1; i < oldItems.length + 10; i++) {
          newItems.push(i);
        }

        if (oldItems.length > 50) {
          setHasMore(false);
          return oldItems;
        }

        return [...oldItems, ...newItems];
      });
    }, 2000);
  };

  const LoaderItem = (
    <img src="https://via.placeholder.com/520x167" alt="loading..." />
  );

  return (
    <div className="App">
      <FlowSlider
        loaderItem={LoaderItem}
        hasMore={hasMore}
        loadMore={loadMore}
        title={<h4>My List</h4>}
        itemsPerPage={6}
      >
        {items.map(i => (
          <FlowItem key={i}>
            <img
              src={`https://picsum.photos/520/360/?${i}a`}
              alt="placeholder"
            />
          </FlowItem>
        ))}
      </FlowSlider>

      <FlowSlider
        loaderItem={LoaderItem}
        hasMore={hasMore}
        loadMore={loadMore}
        title={<h4>My List</h4>}
        itemsPerPage={6}
      >
        {items.map(i => (
          <FlowItem key={i}>
            <img
              src={`https://picsum.photos/520/360/?${i}a`}
              alt="placeholder"
            />
          </FlowItem>
        ))}
      </FlowSlider>

      <FlowSlider
        loaderItem={LoaderItem}
        hasMore={hasMore}
        loadMore={loadMore}
        title={<h4>Upcoming Movies</h4>}
        itemsPerPage={6}
      >
        {items.map(i => (
          <FlowItem key={i}>
            <img
              src={`https://picsum.photos/297/167/?${i}b`}
              alt="placeholder"
            />
            {/* <iframe width="100%" height="167" src="https://www.youtube.com/embed/aVS4W7GZSq0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
          </FlowItem>
        ))}
      </FlowSlider>

      <FlowSlider
        loaderItem={LoaderItem}
        hasMore={hasMore}
        loadMore={loadMore}
        title={<h4>Trending Now</h4>}
        itemsPerPage={6}
      >
        {items.map(i => (
          <FlowItem key={i}>
            <div
              style={{
                color: "#ffffff",
                fontSize: "48px",
                height: "160px",
                lineHeight: "160px",
                backgroundColor: "#0b0b0b"
              }}
            >
              {i}
            </div>
          </FlowItem>
        ))}
      </FlowSlider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
