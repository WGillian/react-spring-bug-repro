import React, { useState, useRef, useEffect } from "react";
import { useTransition, animated } from 'react-spring'
import "./index.css";

const items = [
  { text: 'Item number 1', id: 1 },
  { text: 'Item number 2', id: 2 },
  { text: 'Item number 3', id: 3 },
]

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const renderItems = item => ({ style, onButtonClick }) => {
  return (
    <animated.div style={style} className="absolute">
      <p>{item.text}</p>
      {item.text && <button onClick={() => onButtonClick()}>click to change item</button>}
    </animated.div>
  );
}

function ItemsContainer({ item, onButtonClick }) {
  const [itemsToAnimate, setItemsToAnimate] = useState({ 0: renderItems({text:''}), 1: null})
  const [position, setPosition] = useState(0);
  const transitions = useTransition(position, p => p, {
    unique: true,
    reset: true,
    from: { transform: 'translate3d(0,300px,0)'},
    enter: { transform: 'translate3d(0,0,0)' },
    leave: { transform: 'translate3d(0,-300px,0)' },
  });
  const isDifferentItem = item.id !== usePrevious(item.id);
  useEffect(() => {
    if (isDifferentItem) {
      const nextPosition = (position + 1) % 2;
      setItemsToAnimate({ ...itemsToAnimate, [nextPosition]: renderItems(item) });
      setPosition(nextPosition);
    }
  }, [item, itemsToAnimate, position, isDifferentItem]);
  return (
    <div className="item-wrapper">
      {transitions.map(({ item, props, key }) => {
        const Item = itemsToAnimate[item];
        return <Item style={props} key={key} onButtonClick={onButtonClick} />
      })}
    </div>
  )
}

export default function App() {
  const [count, setCount] = useState(0);
  const onButtonClick = () => {
    setCount((count + 1) % 3);
  }
  const [showAnimation, setShowAnimation] = useState(false);
  const toggleShowAnimated = () => {
    setShowAnimation(!showAnimation)
  }
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <a href="https://www.dogstrust.org.uk/">External link</a>
      <button onClick={() => toggleShowAnimated()}>{showAnimation ? 'hide animation' : 'show animation'}</button>
      {showAnimation ? (
        <ItemsContainer item={items[count]} onButtonClick={onButtonClick} />
      ): (
      <div>Animated component hidden</div>
      )}
    </div>
  );
}
