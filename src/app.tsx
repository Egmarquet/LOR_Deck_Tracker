import { Text, Window, hot, View } from "@nodegui/react-nodegui";
import React, { useState, useEffect, useRef } from "react";
import { useInterval, isEmpty } from "./components/tools"
import { QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
const axios = require('axios');

const minSize = { width: 500, height: 800 };
const port = 21337;
const winIcon = new QIcon(nodeguiIcon);

/*
appState:
  "waiting" (0): waiting for a deck to be played based on gamestate
  "active" (1): actively tracking the deck being played

initialDeckList:
  The initial deck list found by requesting from http://127.0.0.1:21337/static-decklist
  (chaning this only from waiting and do )

currDeckList:
  The current state of the deck list
*/
function App(){
  const [deckActive, setDeckActive] = useState(false);
  const [errState, setErrorState] = useState({});

  const [initialDeckList, setInitialDeckList] = useState({DeckCode:null, CardsInDeck:null});
  const [currDeckList, setCurrDeckList] = useState({DeckCode:null, CardsInDeck:null});

  // Server polling circuit
  useInterval(() => {
    if (!deckActive){
      getInitialState();
    }
    else{
      updateDeckState();
    }
  }, 1500);

  // Setting initial deck state if a deck is detected
  const getInitialState = () => {
    axios.get('http://127.0.0.1:21337/static-decklist')
      .then(function (response){
        if ((response.data.DeckCode) != null && !isEmpty(response.data.CardsInDeck)){
          console.log("deck detected")
          setInitialDeckList(response.data)
          setCurrDeckList(response.data)
          setDeckActive(true)
        }
      })
      .catch(function (error) {
        console.log(error);
      })

  }

  // Updating deck states
  function updateDeckState(){
    console.log("Deck Detected")
    console.log(initialDeckList)
  }

  return (
    <Window
      windowIcon={winIcon}
      windowTitle="Hello 👋🏽"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
        <Text id="welcome-text">Welcome to NodeGui 🐕</Text>
        <Text id="welcome-text">Hello World!</Text>
      </View>
    </Window>
  );
}

const containerStyle = `
  flex: 1;
`;

const styleSheet = `
  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }`;

export default hot(App);
