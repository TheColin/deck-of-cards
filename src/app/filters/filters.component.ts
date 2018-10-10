import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  suits: string[] = ['hearts', 'diamonds', 'spades', 'clubs'];
  cardValues: string [] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  numberOfDecks = 1;
  maxNumberOfCardsInHand = 52 * this.numberOfDecks;
  filtersForm: FormGroup;
  constructor(private deckService: DeckService) { }

  ngOnInit() {
    this.filtersForm = new FormGroup({
      numberOfCardsInHand: new FormControl(null, [Validators.required, this.validateMaxNumberOfCards.bind(this)]),
      filteredSuits: new FormControl(null),
      maxValue: new FormControl('A'),
      minValue: new FormControl('2')
    }, {validators: this.minAndMaxValidator.bind(this) });
    // subscribing to value changes for filtered suits, min and max value
    // to update the max number of cards in the hand accordingly
    this.filtersForm.controls['filteredSuits'].valueChanges.subscribe(
      (value) => {
        this.updateMaxNumberOfCards();
        this.filtersForm.controls['numberOfCardsInHand'].updateValueAndValidity();
      }
    );
    this.filtersForm.controls['minValue'].valueChanges.subscribe(
      (value) => {
        console.log('min value', value);
        this.updateMaxNumberOfCards();
        this.filtersForm.controls['numberOfCardsInHand'].updateValueAndValidity();
      }
    );
    this.filtersForm.controls['maxValue'].valueChanges.subscribe(
      (value) => {
        this.updateMaxNumberOfCards();
        this.filtersForm.controls['numberOfCardsInHand'].updateValueAndValidity();
      }
    );
  }
  onSubmit() {
    this.deckService.drawHand(this.filtersForm);
  }
  validateMaxNumberOfCards(control: FormControl): {[s: string]: boolean} {
    if (control.value > this.maxNumberOfCardsInHand) {
      return {'tooLarge': true};
    }
    return null;
  }
  minAndMaxValidator(form: FormGroup): {[s: string]: boolean} {
    let maxValue = form.controls['maxValue'].value;
    let minValue = form.controls['minValue'].value;
    if (isNaN(maxValue)) {
      maxValue = this.deckService.convertFaceCardToNumber(maxValue);
    }
    if (isNaN(minValue)) {
      minValue = this.deckService.convertFaceCardToNumber(minValue);
    }
    maxValue = Number(maxValue);
    minValue = Number(minValue);
    if (maxValue < minValue) {
      return {'max less then min': true};
    }
    return null;
  }
  updateMaxNumberOfCards(): void {
    const filtered = this.filtersForm.controls['filteredSuits'].value;
    console.log(filtered);
    if (filtered && filtered.length > 0) {
      this.maxNumberOfCardsInHand = ((4 - filtered.length) * this.getSpread()) * this.numberOfDecks;
    } else {
      this.maxNumberOfCardsInHand = this.getSpread() * this.numberOfDecks * 4;
    }
  }
  // gets the range of cards between the max and min
  getSpread(): number {
    let max = this.filtersForm.controls['maxValue'].value;
    let min = this.filtersForm.controls['minValue'].value;
    if (isNaN(max)) {
      max = this.deckService.convertFaceCardToNumber(max);
    }
    if (isNaN(min)) {
     min = this.deckService.convertFaceCardToNumber(min);
    }
    return (max - min + 1);
  }
}
