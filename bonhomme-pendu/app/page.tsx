"use client";

import React from "react";
import { useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GameData } from "./GameData";
import { Hangman } from "@/components/hangman/Hangman";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

enum GameState {
  None,    // 0
  Playing,  // 1
  Won,  // 2
  Lost  // 3
}

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [letter, setLetter] = React.useState<string>("");
  
  const [wronglyGuessedWord, setWronglyGuessedWord] = React.useState<string>("");

  const [nbWrongGuesses, setNbWrongGuesses] = React.useState<number>(0);
  const [revealedWord, setRevealedWord] = React.useState<string>("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);
  const [gameState, setGameState] = React.useState<GameState>(GameState.None);

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    let newHubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5030/Pendu')
    .build();

    newHubConnection.on('GameData', (data:GameData) => {
        setNbWrongGuesses(data.nbWrongGuesses);
        setRevealedWord(data.revealedWord);
        setGuessedLetters(data.guessedLetters);
        setGameState(GameState.Playing);
      });

    newHubConnection.on('Event', (event) => {
      console.log("Event received: ", event);
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

  async function applyEvent(event:any){
    switch(event.eventType){
      case "WrongGuess": {
        setNbWrongGuesses((prev) => prev + 1);
        break;
      }
      case "RevealLetter": {
        setRevealedWord((prev) => setCharAt(prev, event.index, event.letter));
        break;
      }
      case "GuessedLetter": {
        setGuessedLetters((prev) => [...prev, event.letter]);
        break;
      }
      case "Won": {
        setGameState(GameState.Won);
        break;
      }
      case "Lost": {
        setGameState(GameState.Lost);
        setWronglyGuessedWord(event.word);
        // Pour afficher les yeux!
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNbWrongGuesses((prev) => prev + 1);
        break;
      }
    }

    if(event.events){
      for(let e of event.events){
        await applyEvent(e);
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
    <div className="pl-4">
        {isConnected ? (
          <div>
            <div>
              <Button disabled={gameState == GameState.Playing} onClick={() => startGame()}>Démarrer une nouvelle partie!</Button>
            </div>
            {gameState != GameState.None && (
              <div style={{ marginTop: '32px' }}>
                <Hangman nbWrongGuesses={nbWrongGuesses} />
                
                <p style={{ fontSize: '48px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  {revealedWord}
                </p>
                <p style={{ fontSize: '24px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  Lettres: {guessedLetters.join(",")}
                </p>

                
                <form onSubmit={(e) => { e.preventDefault(); guessWord(); }}>
                  <Input
                    className="mr-2 w-12" 
                    type="text" 
                    maxLength={1} 
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button type="button" disabled={letter.length === 0 || gameState != GameState.Playing} onClick={guessWord}>
                    Deviner
                  </Button>
                </form>

                {gameState == GameState.Won && (
                  <div>
                    Félicitations! 🎉🎉🎉
                  </div>
                )}

                {gameState == GameState.Lost && (
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
