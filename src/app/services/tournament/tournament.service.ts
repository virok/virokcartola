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
import { TableService } from '../table/table.service';

@Injectable({
  providedIn: 'root'
})
export abstract class TournamentService {

  collectionName: string = 'tournaments';

  public TournamentType:TournamentType;

  constructor(protected repository: RepositoryService<Tournament>,
    protected _router: Router ,
    protected _teamsService: TeamsService,
    protected _modalService: ModalService,
    protected _tableService: TableService) {
    //super(repository);
    //this.repository.initialize('tournaments');

    //this._teamsService.list().subscribe(teams => this.teams = teams);
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

  public abstract createTournament(tournament: Tournament, teams: Team[]);

  public abstract addScores(round: Round, data: any, tournament: Tournament, roundIndex: number);

  public abstract isCurrentRound(round: Round);
}
