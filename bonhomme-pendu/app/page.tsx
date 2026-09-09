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
  const [letter, setLetter] = React.useState<string>("");
  const [wronglyGuessedWord, setWronglyGuessedWord] = React.useState<string>("");

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
    if(letter.length > 0){
      hubConnection?.invoke("GuessLetter", letter.at(0));
      setLetter("");
    }
  }

  function canStartNewGame(){
    return gameData == null || gameData.lost || gameData.won;
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      guessWord();
    }
  };

  return (
    <div className="p-4">
        {isConnected ? (
          <div>
            <div>
              <button disabled={!canStartNewGame()} onClick={() => startGame()}>Démarrer une nouvelle partie!</button>
            </div>
            {gameData && (
              <div style={{ marginTop: '32px' }}>
                {gameData && <Hangman nbWrongGuesses={gameData.nbWrongGuesses} />}
                
                <p style={{ fontSize: '48px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  {gameData.revealedWord}
                </p>
                <p style={{ fontSize: '24px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  Lettres: {gameData.guessedLetters.join(",")}
                </p>
                
                {!gameData.won && !gameData.lost && (
                  <form onSubmit={(e) => { e.preventDefault(); guessWord(); }}>
                    <input 
                      type="text" 
                      maxLength={1} 
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button type="button" disabled={letter.length === 0} onClick={guessWord}>
                      Deviner
                    </button>
                  </form>
                )}
                
                {gameData.won && (
                  <div>
                    Félicitations! 🎉🎉🎉
                  </div>
                )}
                
                {gameData.lost && (
                  <div>
                    Eeehhh... le mot c'était <b>{wronglyGuessedWord}</b>! Meilleure chance la prochaine fois... 😕
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Connexion en cours...</p>
        )}
    </div>
  );
}
