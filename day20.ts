import { defer, from, fromEvent, interval, of, pipe, timer } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

const observer = {
  next: val => console.log(val),
  error: err => console.log(err),
  complete: () => console.log('complete')
};

//pipe(): Pipeable operator là một func nhận observerable, sau đó return về một observerable. Vì là pure operation nên observable truyền vào sẽ không bị thay đổi giá trị.

//* ==> MỤC ĐÍCH ĐỂ TẠO observerable */

// of(): emit tất cả các giá trị đc truyền vào, sau đó Complete.
of([1, 2, 3]).subscribe(observer);

// from(): tương tư of() nhưng chỉ nhận giá trị truyền vào là Iterable(array, map, set, string) or Promise.
// And: Trả về giá trị resolve của Promise
// And: emit từng phần tử trong mảng.
from([1, 2, 3]).subscribe(observer);

// fromEvent(): lắng nghe sự kiện, ko tự complete
fromEvent(document, 'click').subscribe(observer);

// interval() emit ra một giá trị(từ 0 và tăng dần) sau một khoảng time t
interval(100000000000);

// timer()
// 1. Delay sau 1 khoảng time rồi emit 0
timer(1000).subscribe(observer);
// 2. Dalay sau 1 khoảng time, sau đó sẽ emit giá trị giống interval().
timer(2000, 1000); //Delay 2s, sau đó mỗi 1s sẽ emit 1 giá trị.

// throwError
// defer(): Mỗi lần subscribe sẽ tạo một new observerable. defer() nhận vào môt observerable factory.
const ramdom$ = defer(() => of(Math.random()));
ramdom$.subscribe(observer);
ramdom$.subscribe(observer);
