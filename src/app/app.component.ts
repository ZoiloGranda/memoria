import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Character } from './models'
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'memoria';
	public characters: Character[] = [];
	public cols:Number= 8;
	public gutterSize:String='2px';
	public rowHeight:String='120px';

	constructor(private appService: AppService, breakpointObserver: BreakpointObserver) {
		breakpointObserver.observe([
			Breakpoints.HandsetLandscape,
			Breakpoints.HandsetPortrait
		]).subscribe(result => {
			console.log(result);
			if (result.matches && breakpointObserver.isMatched('(orientation: portrait)')) {
				console.log(breakpointObserver.isMatched('(orientation: portrait)'));
				this.activatePortraitLayout();
			}else{
				this.activateLandscapeLayout();
			}
		});
	}
	ngOnInit() {
		this.appService.getCharactersData(12)
		this.appService.getCharactersUpdateListener()
			.subscribe((characters) => {
				this.characters = this.randomizeArray(characters.characters.concat(characters.characters));
				console.log(this.characters);
			})
	}

	randomizeArray(array) {
		return array.sort(() => Math.random() - 0.5);
	}
	
	activatePortraitLayout(){
		this.cols = 4;
		this.gutterSize='0px';
		this.rowHeight='90px';
	}
	activateLandscapeLayout(){
		this.cols = 8;
		this.gutterSize='2px';
		this.rowHeight='120px'
	}

}
