import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../models'
import { AppService } from '../app.service';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
	@Input() cardData: Character;
	public status: String = 'reset';
	public cleared: Boolean = false;

	constructor(private appService: AppService) { }

	ngOnInit() {
		this.appService.clearMatchedCardsListener()
			.subscribe((matchedCardsId) => {
				console.log(matchedCardsId);
				this.clearCards(matchedCardsId)
			})
	}

	flipCard(cardId) {
		console.log(cardId);
		if (this.status != 'cleared') {
			this.status = this.status === 'flipped' ? 'reset' : 'flipped'
			this.saveFlippedCardId(cardId)
		}
	}

	saveFlippedCardId(cardId) {
		this.appService.setFlippedCardId(cardId)
	}

	checkCards() {
		if (this.status != 'cleared') {
			this.appService.checkMatch()
		}
	}

	clearCards(matchedCardsId) {
		if (this.cardData.id === matchedCardsId) {
			this.status = 'cleared';
		}
	}


}
