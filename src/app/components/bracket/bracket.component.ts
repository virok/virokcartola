import { Component, OnInit } from "@angular/core";
import { Tournament, TournamentType } from "../../entities/tournament";
import { Round } from "../../entities/round";
import { Match } from "../../entities/match";
import { Team } from "../../entities/team";
import { BracketRound } from "src/app/entities/BracketRound";

@Component({
  selector: "app-bracket",
  templateUrl: "./bracket.component.html",
  styleUrls: ["./bracket.component.css"]
})
export class BracketComponent implements OnInit {
  tournament: Tournament;
  totalRounds: number;

  constructor() { }

  ngOnInit() {
    this.loadFakeTournament();
  }

  private loadFakeTournament() {
    this.tournament = new Tournament();
    this.tournament.isRoundRobin = true;
    this.tournament.name = "Fake Tournament";
    this.tournament.tournamentType = this.tournament.isRoundRobin
      ? TournamentType.DoubleElimination
      : TournamentType.SingleElimination;
    this.tournament.rounds = new Array<Round>();
    let teamsArray = new Array<string>();
    for (let index = 1; index <= 32; index++) {
      teamsArray.push(`Fake Team ${index}`);
    }
    let teamsCount = teamsArray.length;
    let gamesPerRound = teamsCount / 2;
    let totalKnockoutRounds = -1;
    let i = teamsCount;
    while (i >= 1) {
      i = i / 2;
      totalKnockoutRounds = totalKnockoutRounds + 1;
    }
    this.totalRounds = totalKnockoutRounds;
    for (let j = 0; j < totalKnockoutRounds; j++) {
      let currentRound = new Round();
      currentRound.number = j + 1;
      let indexToRemove = new Array<number>();
      let newTeamCount = teamsCount;
      let previousIndex = 0;
      for (let k = 0; k < gamesPerRound; k++) {
        let index1 = previousIndex == 0 ? k : previousIndex + 1;
        let index2 = index1 + 1;
        previousIndex = index2;

        if (!currentRound.bracket_rounds) {
          currentRound.bracket_rounds = new Array<BracketRound>();
        }

        let bracketRound = new BracketRound();
        bracketRound.number = k+1;

        if(!bracketRound.games){
          bracketRound.games = new Array<Match>();
        }

        //adding a game
        let firstGame = this.createGame(teamsArray, index1, index2, 3, 0);
        bracketRound.games.push(firstGame);

        if(this.tournament.isRoundRobin){
          let secondGame = this.createGame(teamsArray, index2, index1, 2, 0);
          bracketRound.games.push(secondGame);
        }

        currentRound.bracket_rounds.push(bracketRound);

        indexToRemove.push(k + 1); //removing team 2 to replicate a elimination
      }
      //add current round with games
      this.tournament.rounds.push(currentRound);

      //remove losers
      for (let k = 0; k < indexToRemove.length; k++) {
        teamsArray.splice(indexToRemove[k], 1);
      }
      newTeamCount = teamsArray.length;
      gamesPerRound = newTeamCount / 2;
    }
    console.log(this.tournament);
  }

  private createGame(teamsArray: string[], index1: number, index2: number, score: number, score2:number) {
    let currentGame = new Match();
    currentGame.home = new Team();
    currentGame.home.name = teamsArray[index1];
    currentGame.home_score = score;
    currentGame.away = new Team();
    currentGame.away.name = teamsArray[index2];
    currentGame.away_score = score2;
    return currentGame;
  }

  getIsWinner(homeScore, awayScore) {
    return homeScore > awayScore;
  }

  getIsLoser(homeScore, awayScore) {
    return !this.getIsWinner(homeScore, awayScore);
  }

  getRoundName(round: Round) {

    const roundDifference = this.totalRounds - round.number;
    switch (roundDifference) {
      case 0:
        return "Final";
      case 1:
        return "Semi-Final";
      case 2:
        return "Quartas de Final";
      case 3:
        return "Oitavas";
      case 4:
        return "Rodada dos 16";
      default:
        return `Rodada ${round.number}`
    }
  }
}
