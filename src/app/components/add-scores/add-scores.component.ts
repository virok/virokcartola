import { Component, OnInit, Optional, Self } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { Tournament } from '../../entities/tournament';
import { NgForm } from '@angular/forms';
import { AddScoreService } from '../../services/add-score/add-score.service';

@Component({
  selector: 'app-add-scores',
  templateUrl: './add-scores.component.html',
  styleUrls: ['./add-scores.component.css']
})
export class AddScoresComponent implements OnInit {
  teams: any[];
  showPage: boolean = false;
  tournaments: Tournament[];

  selectedTournaments: string[];

  constructor(private _teamsService: TeamsService,
    protected _addScoreService: AddScoreService
    ) { }

  ngOnInit() {
    this.teams = new Array<Team>();
    this.tournaments = new Array<Tournament>();

    this.load();
  }

  load() {
    this._teamsService.list().subscribe(result => {
      this.teams = result;
      this.loadTournaments();
    });
  }

  private loadTournaments() {
    this._addScoreService.listTournaments().subscribe((tournamentsResult => {
      tournamentsResult = tournamentsResult.filter(x=>x.winner == null);
      this.showPage = this.teams.length > 2 && this.teams.length % 2 == 0 && tournamentsResult.length > 0;
      this.tournaments = tournamentsResult;
      this.selectedTournaments = new Array<string>();
      this.selectedTournaments = this.tournaments.map(x=>x.id);
    }));
  }

  add(inputs: NgForm, tournaments: Tournament[]) {
    const selectedTournamentsObject = tournaments.filter(x=>this.selectedTournaments.indexOf(x.id)>=0);
    this._addScoreService.addScoresToSelectedTournaments(inputs, selectedTournamentsObject);
  }

  onSelectedTournamentsChange(e, tournamentId: string): void {
    if(e.target.checked)
        this.selectedTournaments.push(tournamentId);

    else{
        let index = this.selectedTournaments.indexOf(tournamentId);

        if (index > -1) {
            this.selectedTournaments.splice(index, 1);
        }
    }
}

}


