import { Text, Window, hot, View } from "@nodegui/react-nodegui";
import React, { useState, useEffect, useRef } from "react";
import { useInterval, isEmpty } from "./components/tools"
import { QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
const axios = require('axios');

const minSize = { width: 500, height: 800 };
const winIcon = new QIcon(nodeguiIcon);

/*
appState:
  "menu" (0): waiting for a deck to be played based on gamestate
  "mulligan": muligan state dected, the only way to transition into active
  "active": actively tracking the deck being played

If a mulligan is not detected, then the deck tracker cannot track the state of the
deck, therefore a mulligan must always be found

initialDeckList:
  The initial deck list found by requesting from http://127.0.0.1:21337/static-decklist
  (chaning this only from waiting and do )

currDeckList:
  The current state of the deck list
*/
const ActiveDeck = (props) => {
  const cards = Object.keys(props.currDeckList).map( function(key) {
    const value = props.currDeckList[key]
    return(
      <View
        style={'flex:1; flex-direction:"row"; justify-content:"center"; align-items:"center"; '}
      >
        <View>
          <Text>{key}</Text>
        </View>
        <View>
          <Text>{"x"+value}</Text>
        </View>
      </View>
    );
  })

  return(
    <View>{cards}</View>
  );
}

function App(){
  const [deckActive, setDeckActive] = useState(false);
  const [errState, setErrorState] = useState({});

  // Maps CardID to CardCode
  const [handHistory, setHandHistory] = useState({});

  // Maps CardID to count of card in deck
  const [currDeckList, setCurrDeckList] = useState({});

  // Server polling circuit
  useInterval(() => {
    if (!deckActive){
      getInitialState();
    }
    else{
      updateDeckState();
    }
  }, 1100);

  // Setting initial deck state if a deck is detected
  const getInitialState = () => {
    axios.get('http://127.0.0.1:21337/static-decklist')
      .then(function (response){
        if ((response.data.DeckCode) != null && !isEmpty(response.data.CardsInDeck)){
          console.log(response.data.CardsInDeck);
          setCurrDeckList(response.data.CardsInDeck);
          setDeckActive(true);
        }
        else{
          console.log("Waiting for game")
        }
      })
      .catch(function (error) {
        console.log("LOR window is not active");
      })
  }

  /*
  Parsing rectangle API for the data:
  I.e.
  If the game is in a mulligan state
  If cards in hand vs on board
  Update the history of the game based on cards currently in play
  vs drawn from the previous state

  //
  Get current hand state:
    - compare to previous hand state and get difference
    - subtract from deck if new on board
  */
  // Updating deck states

  const updateDeckState = () => {

    axios.get('http://127.0.0.1:21337/positional-rectangles')
      .then(function (response){
          if (response.data.GameState == "Menus"){
            //cleanup
            setHandHistory({})
            setDeckActive({})
            setDeckActive(false)
          }

          else {

            const height = response.data.Screen.ScreenHeight
            const width = response.data.Screen.ScreenWidth
            const newCards = {}


            //Iterate over rectangles and collect new cards not found in handhistory
            response.data.Rectangles.forEach(function (item, index) {
              if (item.LocalPlayer && item.CardCode != "face" && item.TopLeftY <= 0.5*height && !(item.CardID in handHistory)){
                newCards[item.CardID] = item.CardCode
              }
            });

            // If there are new cards this update
            if (!isEmpty(newCards)) {

              let newDeckState = Object.assign({}, currDeckList);
              let newHandHistory = Object.assign({}, handHistory);

              // For each new card, subtract 1 count from the deck state
              // and update the hand history
              for (const key in newCards) {
                if (newCards[key] in newDeckState) {
                  newDeckState[newCards[key]] = newDeckState[newCards[key]] - 1;
                }
                newHandHistory[key] = newCards[key];
              }
              setHandHistory(newHandHistory);
              setCurrDeckList(newDeckState);
            }
          }
      })

      .catch(function (error) {
        console.log(error);
      });

    }

  return (
    <Window
      windowIcon={winIcon}
      windowTitle="LOR Deck Tracker"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
      <ActiveDeck currDeckList={currDeckList} />
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
