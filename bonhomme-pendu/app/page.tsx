"use client";

import React from "react";
import { useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GameData } from "./GameData";
import { Hangman } from "@/components/hangman/Hangman";
import { Button, Input } from "ui-exercices-5w5";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [letter, setLetter] = React.useState<string>("");
  
  const [won, setWon] = React.useState<boolean>(false);
  const [lost, setLost] = React.useState<boolean>(false);
  const [wronglyGuessedWord, setWronglyGuessedWord] = React.useState<string>("");

  const [nbWrongGuesses, setNbWrongGuesses] = React.useState<number>(0);
  const [revealedWord, setRevealedWord] = React.useState<string>("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);
  const [canStartNewGame, setCanStartNewGame] = React.useState<boolean>(true);

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
        setCanStartNewGame(false);
      });

    newHubConnection.on('Event', (event) => {
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
        setWon(true);
        break;
      }
      case "Lose": {
        setLost(true);
        setWronglyGuessedWord(event.word);
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
    <div className="p-4">
        {isConnected ? (
          <div>
            <div>
              <Button variant="secondary" disabled={!canStartNewGame} onClick={() => startGame()}>Démarrer une nouvelle partie!</Button>
            </div>
            {!canStartNewGame && (
              <div style={{ marginTop: '32px' }}>
                <Hangman nbWrongGuesses={nbWrongGuesses} />
                
                <p style={{ fontSize: '48px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  {revealedWord}
                </p>
                <p style={{ fontSize: '24px', marginTop: '16px', marginBottom: '16px', fontFamily: "'Lucida Grande', monospace" }}>
                  Lettres: {guessedLetters.join(",")}
                </p>

                {!canStartNewGame && (
                  <form onSubmit={(e) => { e.preventDefault(); guessWord(); }}>
                    <Input 
                      type="text" 
                      maxLength={1} 
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <Button type="button" disabled={letter.length === 0} onClick={guessWord}>
                      Deviner
                    </Button>
                  </form>
                )}
                
                {won && (
                  <div>
                    Félicitations! 🎉🎉🎉
                  </div>
                )}
                
                {lost && (
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
