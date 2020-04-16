import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../models'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
@Input() cardData: Character;
public flipped:Boolean=false;

  constructor() { }

  ngOnInit(){
  }
  
  flipCard(event: Event){
   this.flipped = !this.flipped
  }

}
