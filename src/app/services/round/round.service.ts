import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Round } from '../../entities/round';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class RoundService extends BaseService<Round>{

  constructor(protected repository: RepositoryService<Round>) {
    super(repository);
    //this.repository.initialize('Rounds');
  }
}
