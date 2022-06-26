import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {Score} from '../score';
import {MatchService} from "../_services/match.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  matchScore: Score = {
    id: 1,
    setScore: [0, 0],
    gameScore: ['0', '0'],
    tieBreakerScore: [0, 0]
  };
  matchWinner: string = null;
  onTieBreakerMode = false;

  constructor(
    public userService: UserService,
    public matchService: MatchService
  ) {}

  ngOnInit(): void {
  }
  updateMatchScore(winnerSide): void{
    const loserSide = winnerSide === 0 ? 1 : 0;
    const winnerScore = this.matchScore.gameScore[winnerSide];
    const loserScore = this.matchScore.gameScore[loserSide];
    if (this.onTieBreakerMode){
      this.matchScore.tieBreakerScore[winnerSide]++;
      this.updateTieBreakerScore(winnerSide, loserSide);
    }else  {
      if (winnerScore === '40' && loserScore === '40'){
        this.matchScore.gameScore[winnerSide] = 'ADV';
      }else if (winnerScore === '40' && loserScore === 'ADV'){
        this.matchScore.gameScore[winnerSide] = 'DEUCE';
        this.matchScore.gameScore[loserSide] = 'DEUCE';
      }else if (winnerScore === 'DEUCE' && loserScore === 'DEUCE'){
        this.matchScore.gameScore[winnerSide] = 'ADV';
        this.matchScore.gameScore[loserSide] = '40';
      }else if ((winnerScore === 'ADV' && loserScore === '40') || winnerScore === '40'){
        this.matchScore.gameScore[winnerSide] = '0';
        this.matchScore.gameScore[loserSide] = '0';
        this.matchScore.setScore[winnerSide]++;
        this.updateMatchWinner(winnerSide, loserSide);
      }else {
        const intScore = Number(winnerScore);
        this.matchScore.gameScore[winnerSide] = ((intScore !== 30) ? intScore + 15 : intScore + 10).toString();
      }
    }
  }
  updateTieBreakerScore(winnerSide, loserSide): void{
    const winnerScore = this.matchScore.tieBreakerScore[winnerSide];
    const loserScore = this.matchScore.tieBreakerScore[loserSide];
    if (winnerScore >= 7 && winnerScore >= loserScore + 2){
      this.matchScore.setScore[winnerSide]++;
      this.matchWinner = (winnerSide === 0) ? 'Player1' : 'Player2';
    }
  }
  updateMatchWinner(winnerSide, loserSide): void{
    const winnerScore  = this.matchScore.setScore[winnerSide];
    const loserScore = this.matchScore.setScore[loserSide];
    if (winnerScore >= loserScore + 2 && winnerScore >= 6){
      this.matchWinner = (winnerSide === 0) ? 'Player1' : 'Player2';
    }else if (winnerScore === 6 && winnerScore === loserScore){
      this.onTieBreakerMode = true;
    }
  }
}
