import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { Tournament } from 'src/app/entities/tournament';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentType } from '../../entities/TournamentType';
import { TournamentFactoryService } from '../../services/tournament-factory/tournament-factory.service';
import { TeamsService } from '../../services/teams/teams.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

  tournament: Tournament;
  isRoundRobin: boolean;
  tournamentTypes : string[];

  @ViewChild('input_name') tournamentNameInput: ElementRef;
  teams: any;

  constructor(private _tournamentFactory: TournamentFactoryService,
    private _teamsService: TeamsService) {

  }
  private _tournamentService: TournamentService;

  ngOnInit() {
    this.tournament = new Tournament();
    this.loadTournamentTypes();
    this._teamsService.list().subscribe(teams => this.teams = teams);
    // this._activatedRoute.queryParams.subscribe((params: Params) => {
    //   //this.eventId = params['id'];
    // });
  }

  createTournament(){

    this._tournamentService = this._tournamentFactory.create(this.tournament);
    this._tournamentService.createTournament(this.tournament, this.teams);
  }

  loadTournamentTypes(){
    const keys = Object.keys(TournamentType);
    const values = keys.map(k => TournamentType[k as any]);
    this.tournamentTypes = values;
  }

}
