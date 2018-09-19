import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../services/tournament/tournament.service';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {

  constructor(private tournamnetService: TournamentService) { }

  tournaments : any[];
  ngOnInit() {
    this.list();
  }

  list(){
    this.tournamnetService.list().subscribe(result=> this.tournaments = result);
  }

}
