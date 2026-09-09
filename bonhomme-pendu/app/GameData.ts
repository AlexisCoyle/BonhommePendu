export interface GameData {
  nbWrongGuesses:number;
  revealedWord:string;
  won:boolean;
  lost:boolean;
  guessedLetters:string[];
}