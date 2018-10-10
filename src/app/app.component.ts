import { Component } from '@angular/core';
import { CardConfiguration } from './card-configuration';
import { DeckService } from './deck.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zipari-cards';
  constructor(private deckService: DeckService) { }
}
