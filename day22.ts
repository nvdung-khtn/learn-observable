import { asyncScheduler, from, fromEvent, interval, of, timer } from 'rxjs';
import {
  auditTime,
  debounceTime,
  distinct,
  distinctUntilChanged,
  filter,
  find,
  first,
  pluck,
  sampleTime,
  single,
  skip,
  skipUntil,
  skipWhile,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  throttleTime
} from 'rxjs/operators';

// Filtering operators
const items: number[] = [1, 2, 3, 4, 5, 6];
const observer = {
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('completed')
};
// 1. filter: emit value đc filter theo condition
from(items).pipe(filter(x => x % 2 === 0));

// 2. first: get the first item
// + first(): return first item
// + first(condition): return first item thỏa condition
// Nếu không có item nào thỏa điều kiện (or empty observable) => throw error: no elements in sequence
from(items).pipe(first(x => x > 2));

// 3. last

// 4. find: Giống như first nhưng bắt buộc phải truyền condition. và khi không có giá trị nào thỏa điều kiện thì sẽ ko bị throw error và sẽ return về undefined.
from(items).pipe(find(x => x > 2));

// 5. single: sử đụng khi cần duy nhất 1 element. Nếu emit nhiều hơn 1 giá trị thỏa mãn condition => throw error
from(items).pipe(single(x => x > 2));

// 6. take: Truyền số giá trị cần lấy, khi lấy đủ giá trị thì observable thì completed
interval(1000).pipe(take(5));
// take(1) cho kết quả gần tương tự find/first. Điểm khác biệt là khi truyền empty observable thì sẽ không có throw error.

// 7. takeLast
interval(1000).pipe(
  take(5),
  takeLast(2)
);

// 8. takeUntil: Thay vì truyền số lần, thì ta sẽ truyền notify (cái gì mà có thể emit đc: subject, observable), khi nào notify emit thì takeUntil sẽ completed
interval(1000).pipe(takeUntil(fromEvent(document, 'click')));

// 9. takeWhile: Thỏa condition thì emit -> loop. Ko thỏa thì completed. Dùng khi điều kiện muốn stop cái observable nó phụ thuộc vào chính giá trị của observable đó.
interval(1000).pipe(takeWhile(x => x < 5));

// 10. skip: bỏ qua bao nhiêu giá trị.
interval(1000).pipe(skip(5));

// 11. skipUntil/ skipWhile
interval(1000).pipe(skipUntil(timer(3000)));

interval(1000).pipe(skipWhile(x => x < 3));

// 12. distinct
from([1, 2, 3, 4, 5, 5, 4, 3, 6, 1]).pipe(distinct());

// 13. distinctUntilChanged/ distinctUntilKeyChanged('key'): compare two value nearly, if same => skip, different => emit.
from([1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4]).pipe(distinctUntilChanged());

// 14. audit/auditTime (ít dùng)
// + có một timer chạy, trong khi timer chạy, các giá  trị đc emit sẽ bị bỏ qua. Sau khi timer chạy xong, observable sẽ emit giá trị cuối cùng đc emit trước đó. Timer sẽ lặp lại chu kỳ khi lại có giá trị mới đc emit. (Chứ không phải tính tại thời điểm timer vừa dừng xong)
// + Chỉ chạy khi có giá trị đc emit
interval(1500).pipe(auditTime(1500));

//15. sample/sampleTime (ít dùng)
// + Cách run gần giống auditTime
// + Khác là timer sẽ chạy ngay tại thời điểm subscribe(), và chạy lại ngay khi timer disabled và emit giá trị.
interval(1000).pipe(sampleTime(1500));

// 16. throttle/throttleTime
// Khi có một observable emit quá nhiều giá trị, dùng throttleTime để received giá trị đc emit sau một khoảng time nhất định.
// + leading: true: Lấy giá tri đầu tiên.
// +trailing: true: lấy giá trị cuối.
interval(1000).pipe(
  throttleTime(2000, asyncScheduler, { trailing: false, leading: true })
);
// Default: leading: true => Lấy giá trị đầu tiên.

// 17. debounce/debounceTime (Dùng nhiều nhất trong input)
// Sau khi dừng input một khoảng time (tham số trong debounceTime) thì nó mới emit giá trị, còn ko sẽ bị bỏ qua.
const queryInput = document.querySelector('#queryInput');
fromEvent(queryInput, 'keydown').pipe(
  pluck('target', 'value'),
  debounceTime(1500)
);
