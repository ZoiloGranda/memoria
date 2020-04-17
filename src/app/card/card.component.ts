import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../models'
import { AppService } from '../app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
	@Input() cardData: Character;

	public status: String = 'reset';
	public cleared: Boolean = false;
	public containerHeight: Number = 120;
	public containerWidth: Number = 120;
	private blockClick: Boolean = false;

	constructor(private appService: AppService,breakpointObserver: BreakpointObserver) {
		breakpointObserver.observe([
			Breakpoints.HandsetLandscape,
			Breakpoints.HandsetPortrait
		]).subscribe(result => {
			if (result.matches && breakpointObserver.isMatched('(orientation: portrait)')) {
				this.activatePortraitLayout();
			} else {
				this.activateLandscapeLayout();
			}
		});
	}

	ngOnInit() {
		this.appService.clearMatchedCardsListener()
			.subscribe((matchedCardsId) => {
				this.clearCards(matchedCardsId)
			})
		this.appService.flipUnmatchedCardsListener()
			.subscribe((cardId) => {
				this.blockClick = true;
				setTimeout(() => {
					this.resetUnmatchedCards()
					this.blockClick = false;
				}, 1500);
			})

	}

	flipCard(cardId) {
		if (this.appService.getFlippedCardsIds() < 2 && !this.blockClick) {
			if (this.status === 'reset') {
				this.status = 'flipped';
				this.saveFlippedCardId(cardId)
			}
		}
	}

	saveFlippedCardId(cardId) {
		this.appService.setFlippedCardId(cardId)
	}

	checkCards() {
		if (this.status === 'flipped' && this.appService.getFlippedCardsIds() === 2) {
			this.appService.checkMatch()
		}
	}

	clearCards(matchedCardsId) {
		if (this.cardData.id === matchedCardsId) {
			this.status = 'cleared';
		}
	}

	resetUnmatchedCards() {
		if (this.status === 'flipped') {
			this.status = 'reset';
		}
	}

	activatePortraitLayout() {
		this.containerWidth = 90;
		this.containerHeight = 90;
	}

	activateLandscapeLayout() {
		this.containerWidth = 120;
		this.containerHeight = 120;
	}


}
