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
	private charactersUpdated = new Subject<{ characters: Character[] }>()

	constructor(private http: HttpClient) { }

	getCharactersData() {
		return this.http.get<{ data: any }>('https://gateway.marvel.com:443/v1/public/characters?limit=1&apikey=e8e0b11770cdcf7392dfa429b569ddcb')
			.pipe(
				map(data => {
					return {
						characters: data.data.results.map(character => {
							return {
								id: character.id,
								name: character.name,
								image: character.thumbnail.path +'/portrait_medium.' + character.thumbnail.extension
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
	
	getCharactersUpdateListener(){
	return this.charactersUpdated.asObservable()
}

	getCharacters() {
		return this.characters
	}
}
