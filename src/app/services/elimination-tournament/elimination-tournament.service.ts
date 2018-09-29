import { Injectable } from '@angular/core';
import { Round } from '../../entities/round';
import { BracketRound } from '../../entities/bracketRound';
import { Team } from '../../entities/team';
import { Match } from '../../entities/match';
import { Tournament } from 'src/app/entities/tournament';

@Injectable({
  providedIn: 'root'
})
export class EliminationTournamentService {

  teams : Team[];
  constructor() { }

  public createEliminationTournament(tournament, teams: Team[]) {
    let result = false;
    this.teams = teams;
    tournament.rounds = new Array<Round>();

    let teamsCount = this.teams.length;
    let gamesPerRound = teamsCount / 2;
    let totalKnockoutRounds = -1;
    let i = teamsCount;
    while (i >= 1) {
      i = i / 2;
      totalKnockoutRounds = totalKnockoutRounds + 1;
    }

    let currentRound = new Round();
    currentRound.number = 1;
    let indexToRemove = new Array<number>();
    let previousIndex = 0;

    this.createEliminationFirstRound(gamesPerRound, previousIndex, currentRound, tournament, indexToRemove);
    //add current round with games
    tournament.rounds.push(currentRound);

    //new Divide by 2 the teamsCount, to populate the next rounds with fake teams
    gamesPerRound = gamesPerRound / 2;

    this.populateNextRounds(tournament, gamesPerRound, totalKnockoutRounds);

    result = tournament.rounds.length == totalKnockoutRounds;
    console.log(tournament);

    return result;
  }

  private populateNextRounds(tournament: Tournament, gamesPerRound: number, totalKnockoutRounds: number): any {
    totalKnockoutRounds = totalKnockoutRounds - 1;

    for (let index = 0; index < totalKnockoutRounds; index++) {

      let currentRound = new Round();
      currentRound.number = index + 2;
      currentRound.bracket_rounds = new Array<BracketRound>();

      let previousIndex = 0;

      let fakeArrayTeams = new Array<Team>();

      for (let i = 0; i < gamesPerRound; i++) {
        let index1 = previousIndex == 0 ? i : previousIndex + 1;
        let index2 = index1 + 1;
        previousIndex = index2;

        let bracketRound = new BracketRound();
        bracketRound.number = i + 1;
        if (!bracketRound.games) {
          bracketRound.games = new Array<Match>();
        }

        let team1 = new Team();
        team1.name = "";//`Vencedor Jogo ${index1 + 1}`;
        let team2 = new Team();
        team2.name = "";//`Vencedor Jogo ${index2 + 1}`;

        fakeArrayTeams.push(team1);
        fakeArrayTeams.push(team2);

        this.createBracketRoundGames(fakeArrayTeams, index1, index2, bracketRound, tournament, currentRound);
      }

      gamesPerRound = gamesPerRound / 2;

      tournament.rounds.push(currentRound);
    }

  }

  private createEliminationFirstRound(gamesPerRound: number, previousIndex: number, currentRound: Round, tournament: Tournament, indexToRemove: number[]) {
    for (let k = 0; k < gamesPerRound; k++) {
      let index1 = previousIndex == 0 ? k : previousIndex + 1;
      let index2 = index1 + 1;
      previousIndex = index2;
      if (!currentRound.bracket_rounds) {
        currentRound.bracket_rounds = new Array<BracketRound>();
      }
      let bracketRound = new BracketRound();
      bracketRound.number = k + 1;
      if (!bracketRound.games) {
        bracketRound.games = new Array<Match>();
      }
      //adding a game
      this.createBracketRoundGames(this.teams, index1, index2, bracketRound, tournament, currentRound);
      indexToRemove.push(k + 1); //removing team 2 to replicate a elimination
    }
  }

  private createBracketRoundGames(teams: Team[], index1: number, index2: number, bracketRound: BracketRound, tournament: Tournament, currentRound: Round) {
    let firstGame = this.createGame(teams, index1, index2);
    bracketRound.games.push(firstGame);
    if (tournament.isRoundRobin) {
      let secondGame = this.createGame(teams, index2, index1);
      bracketRound.games.push(secondGame);
    }
    currentRound.bracket_rounds.push(bracketRound);
  }

  private createGame(teamsArray: Team[], index1: number, index2: number) {
    let currentGame = new Match();
    currentGame.home = teamsArray[index1];
    currentGame.away = teamsArray[index2];
    return currentGame;
  }
}
