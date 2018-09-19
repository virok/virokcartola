import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Match } from '../../entities/match';
import { BaseService } from 'src/app/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService extends BaseService<Match>{

  constructor(protected repository: RepositoryService<Match>) {
    super(repository);
    //this.repository.initialize('Matches');
  }
}
