import { from, interval, of } from 'rxjs';
import { take } from 'rxjs/operators';

const items: number[] = [1, 2, 3, 4, 5, 6];
const observer = {
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('completed')
};

let count = 1;
function hello(...params) {
  console.log(...params);
  console.log('hello ', count++);
}

function errorFunc(...params) {
  console.log('error: ', params);
}

function completedFunc(...params) {
  console.log('complete ', params);
}

from(items).subscribe(hello, errorFunc, completedFunc);
