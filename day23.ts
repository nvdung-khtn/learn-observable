/** Combination operators */

import {
  combineLatest,
  concat,
  forkJoin,
  from,
  fromEvent,
  interval,
  merge,
  of,
  race,
  zip
} from 'rxjs';
import { delay, map, startWith, take, withLatestFrom } from 'rxjs/operators';

const observer = {
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('completed')
};

// 1. forkJoin (Tương tự Promise.all)
// Chỉ emit (emit ra 1 array) khi tất cả observable đều đã completed
// Lưu ý: forkJoin chỉ nhận giá trị cuối cùng đc emit, trước khi observable đó completed
forkJoin([interval(1000).pipe(take(3)), from('hello').pipe(delay(0))]); // => [2, "o"]

forkJoin([interval(1000).pipe(take(3)), from('hello').pipe(delay(0))]).pipe(
  map(([number, character]) => ({ number, character }))
);

// 2. combineLatest
// Tương tự forkJoin, chỉ khác là ko yêu cầu các element phải completed.
// Dùng cho những stream mà mình ko chắc là nó sẽ completed
// Flow: emit giá trị đầu tiên khi tất cả các stream emit ít nhất 1 lần. Sau đó mỗi khi có stream emit thì combineLatest sẽ emit .
combineLatest([
  interval(2000).pipe(map(x => `First: ${x}`)), // {1}
  interval(1000).pipe(map(x => `Second: ${x}`)), // {2}
  interval(3000).pipe(map(x => `Third: ${x}`)) // {3}
]);
// TH sử dụng: State management,

// 3. zip: zip lại theo từng cặp giá trị.
zip(of(1, 2, 3), of(4, 5, 6), of(7, 8, 9));

// 4. concat: Sẽ lần lượt subscribe vào các child observable theo thứ tự chúng được truyền nào. Chú ý nếu child throw error thì concat sẽ throw error ngay lập tức và bỏ qua các observable phía sau.
// TH sử dụng: Khi các case mà thứ tự là important
concat(of(4, 5, 6).pipe(delay(1000)), of(1, 2, 3));

// 4.merge: merge nhiều stream thành only stream, ai emit cái gì thì nó sẽ emit cái đó, ko quan tâm tới thứ tự.
merge(of(1, 2, 3).pipe(delay(1000)), of(4, 5, 6).pipe(delay(500)));

// 5. race: Giống merge nhưng chỉ quan tâm tới thằng nhanh nhất, reset vòng đua khi thằng đầu emit.
// TH sử dụng: Trong case có nhiều event đều có khả năng xảy ra, nhưng chỉ cần 1 cái xảy ra thì sẽ complete action (close panel)
race(from([1, 2, 3]).pipe(delay(1000)), from([4, 5, 6]).pipe(delay(500)));

// 6. withLatestFrom: Tương tự combineLatest.
// Khác: Chỉ emit giá trị cuối cùng, bỏ qua các giá trị trước đó.
fromEvent(document, 'click').pipe(withLatestFrom(interval(1000)));

const withLatestFrom$ = interval(1000).pipe(
  map(x => `Need latest from this value: ${x}`)
);
fromEvent(document, 'click')
  .pipe(withLatestFrom(withLatestFrom$))

// 7. startWith: muốn start stream này với giá trị (nào đó)
of('world').pipe(startWith('hello'))

// 8. endWith

// 9. pairwise:

