import { Injectable } from '@angular/core';
import { Round } from '../../entities/round';
import { BracketRound } from '../../entities/bracketRound';
import { Team } from '../../entities/team';
import { Match } from '../../entities/match';
import { Tournament } from 'src/app/entities/tournament';
import { TournamentService } from '../tournament/tournament.service';
import { RepositoryService } from '../database/repository.service';
import { Router } from '@angular/router';
import { TeamsService } from '../teams/teams.service';
import { ModalService } from '../modal/modal.service';
import { TournamentType } from '../../entities/TournamentType';
import { TableService } from '../table/table.service';
import { TournamentFactoryService } from '../tournament-factory/tournament-factory.service';

@Injectable({
  providedIn: 'root'
})
export class EliminationTournamentService extends TournamentService  {
  constructor(protected repository: RepositoryService<Tournament>,
    protected _router: Router,
    protected _teamsService: TeamsService,
    protected _modalService: ModalService,
    // protected _tournamentFactory: TournamentFactoryService,
    protected _tableService: TableService) {

    super(repository, _router,_teamsService, _modalService, _tableService);

    this.TournamentType = TournamentType.Elimination;

  }

  public isCurrentRound(round: Round) {
    return round.bracket_rounds.find(b => b.games.find(g => g.away_score == null) != null) != null;
  }

  public createTournament(tournament, teams:Team[]) {
    let hasCreated = false;
    tournament.rounds = new Array<Round>();

    let teamsCount = teams.length;
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

    this.createEliminationFirstRound(teams, gamesPerRound, previousIndex, currentRound, tournament, indexToRemove);
    //add current round with games
    tournament.rounds.push(currentRound);

    //new Divide by 2 the teamsCount, to populate the next rounds with fake teams
    gamesPerRound = gamesPerRound / 2;

    this.populateNextRounds(tournament, gamesPerRound, totalKnockoutRounds);

    hasCreated = tournament.rounds.length == totalKnockoutRounds;
    console.log(tournament);

    if (hasCreated) {
      //it saves on DB
      this.add(tournament).then(() => {
        this._router.navigate(['tournament-list']);
      });
    }else{
      this._modalService.error("Erro ao criar Campeonato");
    }

  }

  public addScores(round: Round, data: any, tournament: Tournament, roundIndex: number) {
    if (round.bracket_rounds != null) {
      round.bracket_rounds.forEach(bracketRound => {
        let match = bracketRound.games.find(x => x.away_score == null);
        if (match) {
          this.addScoreToMatch(match, data);
        }
        let hasAnyMatchLeft = bracketRound.games.find(x => x.away_score == null || x.home_score == null) != null;
        if (!hasAnyMatchLeft) {
          // winner team should move to the next round
          let winnerTeam = this.getWinnerTeam(match);
          let nextRound = tournament.rounds[roundIndex + 1];
          if (nextRound) {
            //find the same bracketRound number or the closest one
            let nextbracketRound = nextRound.bracket_rounds.find(x => x.number == bracketRound.number);
            if (!nextbracketRound) {
              let bracketNumber = bracketRound.number - 1;
              while (nextbracketRound == null && bracketNumber >= 0) {
                nextbracketRound = nextRound.bracket_rounds.find(x => x.number == bracketNumber);
                if (nextbracketRound) {
                  bracketNumber = -1; // exit while
                }
                else {
                  bracketNumber = bracketNumber - 1;
                }
              }
            }
            if (nextbracketRound) {
              //add teams to the bracket round games
              nextbracketRound.games.forEach(x => {
                if (x.home.name == "" || x.home.name == null) {
                  x.home = winnerTeam;
                }
                else if (x.away.name == "" || x.away.name == null) {
                  x.away = winnerTeam;
                }
              });
            }
            else {
              console.error("Not able to find the next bracket Round");
            }
          }
        }
      });
    }
  }

  getWinnerTeam(match: Match): Team {
    return match.home_score > match.away_score ? match.home : match.away;
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

  private createEliminationFirstRound(teams: Team[],gamesPerRound: number, previousIndex: number, currentRound: Round, tournament: Tournament, indexToRemove: number[]) {
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
      this.createBracketRoundGames(teams, index1, index2, bracketRound, tournament, currentRound);
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
