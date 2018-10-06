import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import 'rxjs/Rx';
import { map } from "rxjs/operators"
import { IIdentifier } from 'src/app/entities/IIdentifier';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService<T extends IIdentifier> {

  public collectionName: string;

  collection: AngularFirestoreCollection<T>;
  //private taskDoc: AngularFirestoreDocument<T>;

  constructor(protected db: AngularFirestore) {

  }

  get(collectionName, id){
    return this.db.collection(collectionName).doc(`${id}`).get();
    // this.db.collection(collectionName).doc(`${collectionName}/${id}`).get().subscribe(result=>{
    //   return result.data();
    // });

    // return this.db.collection(collectionName).snapshotChanges().pipe(
    //   map(actions => {
    //       return actions.map(a => {
    //         const data = a.payload.doc.data() as T;
    //         data.id = a.payload.doc.id;
    //         return data;
    //       })}
    //     )
    //   );
  }

  list(collectionName): Observable<any[]> {
    return this.db.collection(collectionName).snapshotChanges().pipe(
      map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as T;
            data.id = a.payload.doc.id;
            return data;
          })}
        )
      );
    //return this.db.collection(collectionName).valueChanges();
  }

  add(collectionName, instance: T) {
    const data = JSON.parse(JSON.stringify(instance));
    return this.db.collection(collectionName).add(data);
  }

  update(collectionName, instance: T): Promise<boolean> {
    const data = JSON.parse(JSON.stringify(instance));
    return this.db.collection(collectionName).doc(instance.id).set(data, { merge: true })
    .then(
      () => {
        return true;
      }
    )
    .catch(() => {
        return false;
      })
  }
}
