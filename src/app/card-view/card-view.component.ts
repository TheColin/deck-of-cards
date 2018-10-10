import { Component, OnInit, Input } from '@angular/core';
import { CardConfiguration } from '../card-configuration';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css']
})
export class CardViewComponent implements OnInit {
  @Input() card: CardConfiguration;
  constructor() { }

  ngOnInit() {
  }
}
