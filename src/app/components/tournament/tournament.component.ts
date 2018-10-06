import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { Tournament } from 'src/app/entities/tournament';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TournamentType } from '../../entities/TournamentType';
import { TournamentFactoryService } from '../../services/tournament-factory/tournament-factory.service';
import { TeamsService } from '../../services/teams/teams.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

  tournament: Tournament;
  isRoundRobin: boolean;
  tournamentTypes : string[];
  tournaments: Tournament[];

  @ViewChild('input_name') tournamentNameInput: ElementRef;
  teams: any;
  id: any;
  service: any;
  isEditing: boolean;
  buttonLabel: string;

  constructor(private _tournamentFactory: TournamentFactoryService,
    private _activatedRoute: ActivatedRoute,
    private _router:Router,
    private _teamsService: TeamsService,
    private _modalSerivice: ModalService
    ) {

  }
  private _tournamentService: TournamentService;

  ngOnInit() {
    this.tournament = new Tournament();
    this.loadTournamentTypes();
    this._teamsService.list().subscribe(teams => this.teams = teams);

    this.service =  this._tournamentFactory.createByTournamentType(TournamentType.Elimination)
    this.loadTournaments();

    this.setEditMode(false);

    this._activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        this.service.get(this.id).subscribe(x => {
          this.tournament = x;
          //console.log(this.tournament);
          this.setEditMode(true);
        })
      }
    });
  }

  loadTournaments() {
   this.service.list().subscribe(result => (this.tournaments = result));
  }

  private setEditMode(value: boolean) {
    this.isEditing = value;
    this.buttonLabel = value? "Atualizar" : "Adicionar";

    if(value == false){
      this.id = null;
    }

  }

  deleteTournament(tournament){
    this._modalSerivice.confirm("Tem Certeza que deseja apagar este campeonato?",
    "Apagar","Cancelar").then(x=>{
      this.service.delete(tournament.id).then(
        ()=>{
          // this.loadTournaments();
          // this.setEditMode(false);
          this._router.navigate(['tournaments']);
        }
      )
    })
  }

  createTournament(){

    this._tournamentService = this._tournamentFactory.create(this.tournament);
    if(this.isEditing == false){
      this._tournamentService.createTournament(this.tournament, this.teams);
    }else{
      this._tournamentService.update(this.tournament).then(()=>
        this._router.navigate(['tournaments'])
      );
    }

  }

  loadTournamentTypes(){
    const keys = Object.keys(TournamentType);
    const values = keys.map(k => TournamentType[k as any]);
    this.tournamentTypes = values;
  }

  public gotoSection() {
    //this will provide smooth animation for the scroll
    this.tournamentNameInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

}
