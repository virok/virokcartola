import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Table } from '../../entities/table';
import { BaseService } from 'src/app/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class TableService extends BaseService<Table>{

  constructor(protected repository: RepositoryService<Table>) {
    super(repository);
    //this.repository.initialize('Tables');
  }
}
