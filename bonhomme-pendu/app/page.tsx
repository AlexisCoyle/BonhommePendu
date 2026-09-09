"use client";

import React from "react";
import { useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GameData } from "./GameData";
import { Hangman } from "@/components/hangman/Hangman";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [gameData, setGameData] = React.useState<GameData | undefined>();

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    let newHubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5030/Pendu')
    .build();

    newHubConnection.on('GameData', (data:GameData) => {
        console.log("Data:");
        console.log(data);
        setGameData(data);
        
        //this.hangman.restart(data.nbWrongGuesses);
      });

    newHubConnection.on('Event', (event) => {
        console.log("Event:");
        console.log(event);
        applyEvent(event);
      });
    
    newHubConnection
      .start()
      .then(() => {
        console.log('La connexion est live!');
        setIsConnected(true);
      })
      .catch(err => console.log('Error while starting connection: ' + err))

    setHubConnection(newHubConnection);
  }

  function startGame(){
    hubConnection?.invoke("StartGame");
  }

  function guessWord(){
    /* TODO:
    hubConnection?.invoke("GuessLetter", this.letter.at(0));
    this.letter = "";*/
  }

  function canStartNewGame(){
    /* TODO:
    return this.gameData == null || this.gameData.lost || this.gameData.won;*/
  }

  async function applyEvent(event:any){
    if(gameData)
    {
      switch(event.eventType){
        case "WrongGuess": {
          gameData.nbWrongGuesses++;
          //hangman.showMore();
          break;
        }
        case "RevealLetter": {
          gameData.revealedWord = setCharAt(gameData.revealedWord, event.index, event.letter);
          break;
        }
        case "GuessedLetter": {
          gameData.guessedLetters.push(event.letter);
          break;
        }
      }

      if(event.events){
        for(let e of event.events){
          await applyEvent(e);
        }
      }
    }
  }

  function setCharAt(str:string, index:number, chr:string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

  return (
    <div className="p-4">
        {isConnected ? (
          <div>
            <p>Connecté au serveur!</p>
            {gameData && <Hangman nbWrongGuesses={gameData.nbWrongGuesses} />}
          </div>
        ) : (
          <p>Connexion en cours...</p>
        )}
    </div>
  );
}
