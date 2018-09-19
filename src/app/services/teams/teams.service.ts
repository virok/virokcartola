import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Team } from 'src/app/entities/team';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

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

  list(): Observable<any[]> {
    return this.repository.list(this.collectionName);
  }

  add(team: Team) {
    return this.repository.add(this.collectionName,team);
  }
}
