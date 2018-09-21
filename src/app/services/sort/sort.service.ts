import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() {
  }


  // Use examples
  // documents.sort(this.SortService.compareValues('createdAt')); sorts documents objects ascending based on createdAt property
  // users.sort(this.SortService.compareValues('name', 'desc')); sorts users objects descending based on name

  compareValues(key, order = 'asc') {

    const compareFunction = (a, b) => {
      let varA: any;
      let varB: any;

      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      varA = a[key];
      varB = b[key];

      varA = (typeof varA === 'string') ?
        varA.toUpperCase() : varA;
      varB = (typeof varB === 'string') ?
        varB.toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };

    return compareFunction;
  }
}
