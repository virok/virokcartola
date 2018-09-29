import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Tournament } from '../../entities/tournament';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { Observable } from 'rxjs/internal/Observable';
import { ModalService } from '../modal/modal.service';
import { Router } from '@angular/router';
import { TournamentType } from '../../entities/TournamentType';
import { Round } from '../../entities/round';
import { Match } from '../../entities/match';
import { NgForm } from '@angular/forms';
import { TournamentFactoryService } from '../tournament-factory/tournament-factory.service';
import { TableService } from '../table/table.service';

@Injectable({
  providedIn: 'root'
})
export abstract class TournamentService {

  collectionName: string = 'tournaments';

  teams: Team[];
  public TournamentType:TournamentType;

  constructor(protected repository: RepositoryService<Tournament>, protected _router: Router
    , protected _teamsService: TeamsService, protected _modalService: ModalService,
    protected _tournamentFactory: TournamentFactoryService, protected _tableService: TableService) {
    //super(repository);
    //this.repository.initialize('tournaments');

    this._teamsService.list().subscribe(teams => this.teams = teams);
  }

  public list(): Observable<any[]> {
    return this.repository.list(this.collectionName);
  }

  public get(id: any) {
    return this.repository.get(this.collectionName, id);
  }

  public add(tournament: Tournament) {
    return this.repository.add(this.collectionName, tournament)
      .then(() => {
        this._modalService.success("Campeonato criado com sucesso");
      }, () => {
        this._modalService.error("Erro ao criar Campeonato");
      });
  }

  public update(tournament: Tournament, showSucessMessage: boolean = false) {
    return this.repository.update(this.collectionName, tournament).then(() => {
      if (showSucessMessage) {
        this._modalService.success("Campeonato atualizado com sucesso");
      }
    }, () => {
      this._modalService.error("Erro ao Atualizar Campeonato");
    });
  }

  public addScoresToSelectedTournaments(inputs: NgForm, tournaments: Tournament[]) {
    const data = inputs.value;
    let hasTournamentRoundsToPopulate = false;

    let tournamentServices = new Array<TournamentService>();
    tournamentServices.push(this._tournamentFactory.createByTournamentType(TournamentType.RoundRobin));
    tournamentServices.push(this._tournamentFactory.createByTournamentType(TournamentType.Elimination));

    //for each tournament
    tournaments.forEach(tournament => {

      let service = tournamentServices.find(x=>x.TournamentType == tournament.tournamentType);
      let foundAnEmptyRound = false;

      let roundIndex = 0;
      tournament.rounds.forEach(round => {

        if (!foundAnEmptyRound) {
          const isRegularTournament = tournament.tournamentType == TournamentType.RoundRobin || tournament.tournamentType == null;

          //find the current round of a tournament(it is first with no games/matches with scores)
          const isCurrentRound = this.isCurrentRound(round);
          //for each match, get and update the score like: match.home_score = data[match.home.name]
          //away_score = data[match.away.name]
          if (isCurrentRound) {
            service.addScores(round, data, tournament, roundIndex);

            foundAnEmptyRound = true;
            hasTournamentRoundsToPopulate = true;

            //After every team has its score updated for that round
            //create a table data / table if not created yet.
            if(isRegularTournament){
              this._tableService.createOrUpdateTable(tournament, round);
            }

            //persist match values in FIRE STORE NOSQL
            //TODO Check if it is going to update
            service.update(tournament, false);

            //redict to tournaments page
            this._router.navigate(["tournament-list"]);
          }
        }

        roundIndex + roundIndex + 1;
      });

    });

    if (!hasTournamentRoundsToPopulate) {
      this._modalService.warning("Todos os Campeonatos já estão preenchidos");
      //redict to tournaments page
      this._router.navigate(["tournament-list"]);
    }
  }

  public addScoresToMatches(games: Match[], data: any) {
    games.forEach(match => {
      this.addScoreToMatch(match, data);
    });
  }

  public addScoreToMatch(match: Match, data: any) {
    if (match.home_score == null)
      match.home_score = data[match.home.name];
    if (match.away_score == null)
      match.away_score = data[match.away.name];
  }

  public abstract createTournament(tournament: Tournament);

  public abstract addScores(round: Round, data: any, tournament: Tournament, roundIndex: number);

  public abstract isCurrentRound(round: Round);
}
