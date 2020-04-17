import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Character } from './models'
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	public characters: Character[] = []
	public flippedCardsIds: Number[] = [];
	public clearMatchedCards = new Subject<Number>()
	public flipUnmatchedCards = new Subject<Boolean>()
	private charactersUpdated = new Subject<{ characters: Character[] }>()

	constructor(private http: HttpClient) { }

	getCharactersData() {
		return this.http.get<{ data: any }>('https://gateway.marvel.com:443/v1/public/characters?limit=2&apikey=e8e0b11770cdcf7392dfa429b569ddcb')
			.pipe(
				map(data => {
					return {
						characters: data.data.results.map(character => {
							return {
								id: character.id,
								name: character.name,
								image: character.thumbnail.path + '/portrait_medium.' + character.thumbnail.extension
							}
						})
					}
				})
			)
			.subscribe((charactersData) => {
				this.characters = charactersData.characters;
				this.charactersUpdated.next({
					characters: [...this.characters]
				})
			})
	}

	getCharactersUpdateListener() {
		return this.charactersUpdated.asObservable()
	}

	getCharacters() {
		return this.characters
	}

	setFlippedCardId(cardId: Number) {
		this.flippedCardsIds.push(cardId)
	}

	checkMatch() {
		console.log('checking');
		if (this.flippedCardsIds.length === 2) {
			if (this.flippedCardsIds[0] === this.flippedCardsIds[1]) {
				console.log('we have a match');
				this.clearMatchedCards.next(this.flippedCardsIds[0])
				this.flippedCardsIds = []
				return true
			} else {
				console.log('we dont have a match');
				this.flipUnmatchedCards.next(true)
				this.flippedCardsIds = []
				return false
			}
		}
	}

	clearMatchedCardsListener() {
		return this.clearMatchedCards.asObservable()
	}
	
	flipUnmatchedCardsListener() {
		return this.flipUnmatchedCards.asObservable()
	}
	
	getFlippedCardsIds(){
		return this.flippedCardsIds.length
	}
}
