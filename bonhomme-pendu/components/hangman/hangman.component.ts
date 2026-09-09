import { Component } from '@angular/core';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent {

  index:number = 0;
  parts:HTMLCollectionOf<Element> | null;
  constructor() {
    this.parts = document.getElementsByClassName("part");
  }

  restart(nbTries:number) {
    console.log("restart");
    if(!this.parts)
      return;

    for(let i = 0; i < this.parts.length; i++){
      let element = this.parts.item(i) as HTMLElement;
      element.style.opacity = "0";
      let classes = element?.classList;
      classes?.remove("fadeIn");
    }

    for(let i = 0; i < nbTries; i++){
      this.showMore();
    }
    this.index = nbTries;
  }

  showMore() {
    if(!this.parts)
      return;

    // Affiche un élément de plus
    this.parts.item(this.index)?.classList.add("fadeIn");
    this.index++;
  }
}
