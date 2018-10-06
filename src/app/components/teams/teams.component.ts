import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament/tournament.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: any[];
  team: Team;
  @ViewChild('input_name') teamNameInput: ElementRef;
  id: any;
  selectedTeam : any;
  isEditing: boolean;
  buttonLabel: string;

  constructor(private _teamsService: TeamsService,
    private _toaster: ToasterService,
    private _activatedRoute: ActivatedRoute,
    private _tournamentService: TournamentService,
    private _router:Router
  ) { }

  ngOnInit() {

    this.setEditMode(false);
    this.team = new Team();
    this.teams = new Array<Team>();
    this.load();

    this._activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        this._teamsService.get(this.id).subscribe(x => {
          this.team = x;
          this.setEditMode(true);
        })
      }
    });
  }

  public gotoSection() {
    //this will provide smooth animation for the scroll
    this.teamNameInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  private setEditMode(value: boolean) {
    this.isEditing = value;
    this.buttonLabel = value? "Atualizar" : "Adicionar";

    if(value == false){
      this.id = null;
    }

  }

  load() {
    this._teamsService.list().subscribe(result => (this.teams = result));
  }

  save() {

    if (this.team.name) {
      // const tempTeam = new Team();
      // tempTeam.name = this.team.name;

      // save on at DB
        if(this.isEditing){
          this.team.id = this.id;
        }

        this._teamsService.save(this.team).then(result => {
          if (result) {
            let teamCopy: Team = new Team;
            Object.assign(teamCopy,this.team);

            this._tournamentService.updateTeamInTournaments(teamCopy);
            //.subscribe(tournamentResult=>{
             // if(tournamentResult){
                this.successSave(this.isEditing? "Atualizado": "Adicionado");
                this._router.navigate(['teams']);
             // }else{
               // this._toaster.pop('error', '', this.isEditing?  'Erro ao atualizar time': 'Erro ao incluir time');
              //  this._router.navigate(['teams']);
              //}
           // })
          } else {
            this._toaster.pop('error', '', this.isEditing?  'Erro ao atualizar time': 'Erro ao incluir time');
          }
        });
      }
  }

  private successSave(message) {
    this.team.name = '';
    setTimeout(() => {
      this.teamNameInput.nativeElement.focus();
    }, 100);
    this._toaster.pop('success', '', `'Time ${message} com sucesso`);
  }
}
