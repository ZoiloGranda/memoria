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
	characters: Character[] = [];
	cols:Number= 8;
	gutterSize:String='2px';
	rowHeight:String='120px';
	activateFireworks:Boolean=false;

	constructor(private appService: AppService, breakpointObserver: BreakpointObserver) {
		breakpointObserver.observe([
			Breakpoints.HandsetLandscape,
			Breakpoints.HandsetPortrait
		]).subscribe(result => {
			if (result.matches && breakpointObserver.isMatched('(orientation: portrait)')) {
				this.activatePortraitLayout();
			}else{
				this.activateLandscapeLayout();
			}
		});
	}
	ngOnInit() {
		this.startGame()
	}
	
	startGame(){
		this.appService.getCharactersData()
		this.appService.getCharactersUpdateListener()
		.subscribe((characters) => {
			this.characters = this.randomizeArray(characters.characters.concat(characters.characters));
		})
		this.appService.activateFireworksListener()
		.subscribe((value) => {
			this.activateFireworks = value;
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
	
	initiateGameRestart(){
		this.appService.setInitiateGameRestartListener(true)
		this.characters = [];
		this.activateFireworks = false;
		this.startGame();
	}
	

}
