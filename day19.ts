import { Observable } from 'rxjs';

console.log('Day 19');

function observer() {
  next: console.log();
}
const observable = new Observable(function subcribe(observer) {
  const id = setTimeout(() => {
    observer.next('next');
    observer.complete();
  }, 1000);

  return function unSubcribe() {
    clearTimeout(id);
  };
});

// C1: observable.subscribe(nextFn, errorFn, completeFn);
const subscription = observable.subscribe({
  next: val => console.log(val),
  error: error => console.log(error),
  complete: () => console.log('complete')
});
