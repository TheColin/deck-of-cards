import { Injectable } from '@angular/core';
import { CardConfiguration } from './card-configuration';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  deck: CardConfiguration[] = new Array();
  drawnHand: CardConfiguration[] = new Array();
  suits: string[] = ['hearts', 'diamonds', 'spades', 'clubs'];
  cardValues: string [] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  numberOfDecks = 1;
  constructor() {
    this.generateDeck();
  }
  generateDeck(): void {
    for (let i = 0; i < this.numberOfDecks; i++) {
      for (const value of this.cardValues) {
        for (const suit of this.suits) {
          this.deck.push(new CardConfiguration(suit, value));
        }
      }
    }
  }
  // randomizes the deck by swapping two random locations in the deck of cards
  // 50 is an arbitrary number, should be increased / tested if we increase numberOfDecks from 1
  shuffleDeck(): void {
    let index1, index2;
    let card1, card2;
    for (let i = 0; i < 50; i++) {
      index1 = Math.floor(Math.random() * 52 * this.numberOfDecks);
      index2 = Math.floor(Math.random() * 52 * this.numberOfDecks);
      card1 = this.deck[index1];
      card2 = this.deck[index2];
      this.deck[index1] = card2;
      this.deck[index2] = card1;
    }
  }
  drawHand(form: FormGroup): void {
    this.drawnHand = [];
    this.shuffleDeck();
    let index = 0;
    let card;
    const suitsToFilter = form.controls['filteredSuits'].value;
    // need to grab the values from the form control because they might not be numbers
    let maxVal = form.controls['maxValue'].value;
    let minVal = form.controls['minValue'].value;
    if (isNaN(maxVal)) {
      maxVal = this.convertFaceCardToNumber(maxVal);
    }
    if (isNaN(minVal)) {
      minVal = this.convertFaceCardToNumber(minVal);
    }
    while (this.drawnHand.length < form.controls['numberOfCardsInHand'].value) {
      card = this.deck[index];
      if (this.cardInRange(card.value, maxVal, minVal) &&
          this.suitNotFiltered(card.suit, suitsToFilter)) {
            this.drawnHand.push(card);
      }
      index++;
    }
  }
  // test that a card value is within the max and min range
  cardInRange(value: any, maxVal: number, minVal: number): boolean {
    if (isNaN(value)) {
      value = this.convertFaceCardToNumber(value);
    }
    value = Number(value);
    maxVal = Number(maxVal);
    minVal = Number(minVal);
    if (minVal <= value && value <= maxVal) {
      return true;
    }
    return false;
  }
  // test that the card's suit is not in the filtered suits array
  suitNotFiltered(suit: string, filteredSuits: string[]): boolean {
    if (filteredSuits && filteredSuits.indexOf(suit) > -1) {
      return false;
    }
    return true;
  }
  // convert a face card to a value for comparison to numeric cards
  convertFaceCardToNumber(value: string): number {
    switch (value) {
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
      default:
        return null;
    }
  }
}
