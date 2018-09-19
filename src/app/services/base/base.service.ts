import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Observable } from 'rxjs';
import { IIdentifier } from 'src/app/entities/IIdentifier';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends IIdentifier> {

  constructor(protected repository: RepositoryService<T>) { }

  // public list(): Observable<any[]> {
  //   return this.repository.list();
  // }

  // public add(instance: T) {
  //   return this.repository.add(instance);
  // }
}
