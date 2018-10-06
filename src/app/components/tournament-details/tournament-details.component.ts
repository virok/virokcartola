import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { Params, ActivatedRoute } from '@angular/router';
import { TournamentType } from 'src/app/entities/TournamentType';



@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.css']
})
export class TournamentDetailsComponent implements OnInit {
  tournament: any
  id: any;
  constructor(private tournamnetService: TournamentService,
    private _activatedRoute: ActivatedRoute, ) {

  }

  ngOnInit() {

    this._activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.get();
    });

  }

  get() {
    this.tournamnetService.get(this.id).subscribe(result => {
      this.tournament = result;
      console.log(this.tournament)
    });
  }

  isRegularTournament(){
    return this.tournament != null && (this.tournament.tournamentType == TournamentType.RoundRobin || this.tournament.tournamentType == null);
  }
}
