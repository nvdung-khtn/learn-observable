/**  Transformation operators */

// RxJS < 5.5: dot-chained operators
// VD: observable.map().takeUntil()
//observable.prototype.map = () => {};

// RxJS >  5.5: Pipeable operators
/* VD: observable.pipe(
  map().
  takeUntil(),
) */

import { fromEvent, interval, merge, observable, Observable, of } from 'rxjs';
import { buffer, bufferTime, delay, map, mapTo, pluck, reduce, scan, toArray } from 'rxjs/operators';

interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  age: number;
}

const users = [
  {
    id: 'ddfe3653-1569-4f2f-b57f-bf9bae542662',
    username: 'tiepphan',
    firstname: 'tiep',
    lastname: 'phan',
    age: 20
  },
  {
    id: '34784716-019b-4868-86cd-02287e49c2d3',
    username: 'nartc',
    firstname: 'chau',
    lastname: 'tran',
    age: 30
  }
];
const observer = {
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('completed')
};

const source = new Observable<User>(observer => {
  setTimeout(() => {
    observer.next(users[0]);
  }, 1000);
  setTimeout(() => {
    observer.next(users[1]);
    observer.complete();
  }, 3000);
});

//source.subscribe(observer);

// 1. map: nhận giá trị đc emit ở parent or previous observable
// C1:

source.pipe(map(user => user.firstname + ' ' + user.lastname));

// C2.
merge(of(users[0]).pipe(delay(2000)), of(users[1]).pipe(delay(4000))).pipe(
  map(user => ({ ...user, fullName: `${user.firstname} ${user.lastname}` }))
);

// 2. pluck (nhổ): get a property in observable
const params$ = of({ id: 123, foo: { bar: 'Dung' } });
const id$ = params$.pipe(pluck('id'));
const nested$ = params$.pipe(pluck('foo', 'bar'));

// 3. mapTo: when one event(observable) emit => we will received a fixed value
merge(
  fromEvent(document, 'mouseenter').pipe(mapTo(true)),
  fromEvent(document, 'mouseleave').pipe(mapTo(false))
);

// 4. reduce: giống Array.reduce(only reduce when completed)
const totalAge$ = merge(
  of(users[0]).pipe(delay(2000)),
  of(users[1]).pipe(delay(4000))
).pipe(reduce((acc, cur: User) => acc + cur.age, 0));

// 5. toArray: transform emited observable to array.
const myArray$ = merge(
  of(users[0]).pipe(delay(2000)),
  of(users[1]).pipe(delay(4000))
)
  .pipe(toArray())

// 6. buffer: store data until one event nào đó trigger thì mới emit
const source$ = interval(1000);
const click$ = fromEvent(document, 'click');
source$.pipe(buffer(click$));

// 7. bufferTime: same as buffer nhưng thay vì dùng hiệu lệnh thì use timer.
//Vd: 2s thì output value 1 lần.
source$.pipe(bufferTime(2000));

// 8. scan: Khá giống reduce nhưng khác là sẽ emit accumulator trên từng phần tử.
totalAge$.pipe(scan((acc, cur:User) => cur.age+ acc, 0))
