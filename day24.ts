import { defer, iif, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  delay,
  every,
  map,
  retry,
  throwIfEmpty
} from 'rxjs/operators';

/** Error Handling */

const observer = {
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('completed')
};

const handleError = () => console.log('Handle error. Alerting the users');

// 1. catchError
// C1: handle tại next
const observable = throwError('I am a error').pipe(
  catchError((err, caught) => {
    handleError();
    return of(400);
  })
);

// C2: handle tại error
throwError('I am a error').pipe(
  catchError((err, caught) => {
    handleError();
    const newError = new Error('this is a new error');
    return throwError(newError);
  })
);

// 2. retry: Muốn retry bao nhiêu lần. resubscribe với một số lần nhất định vào source Observable khi có error emit từ source.
const cached = [4, 5];
of(1, 2, 3, 4, 5)
  .pipe(
    map(n => {
      if (cached.includes(n)) {
        throw new Error('Duplicated: ' + n);
      }
      return n;
    })
  )
  .subscribe(observer);

/** Conditional operators */
// 3. defaulltIfEmpty/ throwIfEmpty: Trả về value/error nếu sourceObservable is empty
of().pipe(
  delay(3000),
  defaultIfEmpty('default value')
);

of().pipe(
  delay(3000),
  throwIfEmpty(() => 'error')
);

// 4. every: check if all element đều thỏa mãn condition thì => true. Ngược lại nếu có ít nhất 1 cái không thỏa mãn => false.
of(1, 2, 3).pipe(every(x => x > 0));

// 5. iif:
// + true => run trueObs()
// +false => run falseObs()
// syntax: iif(()=> true, trueObs, falseObs).subscribe();
const userId = 123;

function updateObservable() {
  return of('update');
}

function createObservable() {
  return of('create');
}

iif(() => userId == null, createObservable(), updateObservable());

// iif đánh giá trueObs và falseObs tại thời điểm viết. Nên nếu một trong hai observable function thrrow error => iif() sẽ error.
// Cách khắc phục: Use defer()
defer(() => {
  return userId == null ? createObservable() : updateObservable();
});
