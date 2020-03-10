import React, { useState, useEffect, useRef } from "react";

// Polling Hook, credit to: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Check to see if the current 
const isEmpty = (obj) => {
  if (obj == null){
    return true
  }
  else{
    return Object.getOwnPropertyNames(obj).length == 0;
  }
}

export { useInterval, isEmpty };
