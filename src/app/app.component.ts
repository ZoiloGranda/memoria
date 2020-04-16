import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Character } from './models'
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'memoria';
	public characters: Character[] = []

	constructor(private appService: AppService) { }

	ngOnInit() {
		this.appService.getCharactersData()
		this.appService.getCharactersUpdateListener()
			.subscribe((characters) => {
				this.characters = this.randomizeArray(characters.characters.concat(characters.characters));
				console.log(this.characters);
			})
	}

	randomizeArray(array) {
		return array.sort(() => Math.random() - 0.5);
	}


}
