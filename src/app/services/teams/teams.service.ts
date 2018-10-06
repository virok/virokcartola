import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Team } from 'src/app/entities/team';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';
import { TournamentService } from '../tournament/tournament.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService{

  collectionName: string = 'teams';
  constructor(protected repository: RepositoryService<Team>) {
    // //super(repository);
    // this.repository.initialize('teams');
  }

  teams: any[];

  save(team: Team): any {
    return team.id ? this.update(team) : this.add(team);
  }

  get(id: any): any {
    return this.repository.get(this.collectionName,id);
  }

  list(): Observable<any[]> {
    return this.repository.list(this.collectionName);
  }

  update(team: Team) {
    return this.repository.update(this.collectionName,team);
  }

  add(team: Team) {
    return this.repository.add(this.collectionName,team);
  }
}
