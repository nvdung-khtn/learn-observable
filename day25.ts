import { interval, merge, of } from 'rxjs';
import { map, mergeAll, partition, tap } from 'rxjs/operators';

/** RxJS Higher Order Observables and Utility Operators */
const observer = {
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log('completed'),
};

const hoo = interval(1000) // Outer observable (parent observable)
  .pipe(
    map((val) => of(`I am at: ${val}`)), // Inner observable (child observable)
    mergeAll()
  );

// Convert higher order observable => first order observable
// 1. mergeAll(): merge tất cả các observable đc trigger và cùng chạy. Nếu truyền tham số concurrent: (Quy định số observable tối đa có thể chạy đồng thời, sau khi chạy xong sẽ chạy những observable còn lại )
// 2. switchAll()
// 3. concatAll(): subscribe lần lượt, có thứ tự các observable đc trigger
//VD: hoo.subscribe(console.log)

// Vì việc dùng Observable bên ngoài để tạo 1 cái Observable bên trong được sử dụng quá nhiều và có một số khuyết điểm khi làm việc vs Promise => tạo ra một số operators sau:
// 1. mergeMap() = mergeAll() + map()
// Tương tự switchMap() nhưng sẽ ko cancel Observable1 khi có Observable 2
// Dễ bị memory lead
// Thích hợp vs write dữ liệu vào DB
// Có tham số concerrent để chỉ ra có bao nhiêu inner observable có thể chạy đồng thời, nếu concerrent = 1 thì mergerMap = concatMap
// => subscribe vào cả 3, số lượng subscribe phụ thuộc vào concurrent.
// 2, switchMap() = switchAll() + map() (use nhiều nhất)
// => return về inner Observable và subcribe vào đó. Giá trị nhận được là một giá trị bt.
// Đang subscribe vào observable_1 mà có Observable_2 => cancel observable_1 và subscribe Observable_2
// Áp dụng cho trường hợp filter dữ liệu, khi user đổi keyword thì ngay lập tức hủy bỏ truy vấn cũ (try vấn vs old keyword).
// Chỉ nên áp dụng vs GET, để tránh gây ra race condition.
// Không bằng mergeAll()+map() trong trường hợp làm việc với Promise vì tính chất non-cancellable
// 3. concatMap() = concatAll() + map()
// TH use: Với big form.
// subcribe vào observable_1 => completed. Then subscribe vào Observable_2 => completed
// Phù hợp với các tác vụ cần thứ tự thực hiện

// 4. exhaustMap()
// TH use: Form chỉ cho submit một lần.
// Có 3 Observables, exhaustMap() sẽ subscribe vào Observable_1 và trong thời gian đó thì các observable khác sẽ bị cancel giá trị

/** Với trường hợp cần subscribe vào inner Observable mà Observable này ko bị phụ thuộc vào Outer Observable bên ngoài thì nên dùng: switch/concat/mergeMapTo() tham số là projectFn()*/

// 5. partition(): Những giá trị thỏa => Observable_1. Giá trị ko thỏa => Observable_2
/*
const source$ = interval(1000);

const [even$, odd$] = partition(source$, x => x%2===0);

merge(
  even$.pipe(map(even => `even: ${even}`)),
  odd$.pipe(map(odd => `odd: ${odd}`))
) */

/** Utility Operators */
// 1.tap: signature same as subscribe(), không làm thay đổi giá trị
// TH use: debugger, tại một thời điểm t, thay đổi giá trị của một variable
interval(1000).pipe(
  tap((val) => console.log('before map', val)),
  map((val) => val * 2),
  tap((val) => console.log('after map', val))
);

// 2. delay()/delayWhen()
// 3. finalize(cb()): sẽ run cb() khi stream completed or error
// 4. repeat(): repeat 1 stream nào đó một số lần nhất định
// 5. timeInterval: đo time giữa 2 lần emit
// 6. timeout(time): sẽ throw Error nếu hết time mà source$ không emit giá trị
// 7. timeoutWith(): Khi hết time thì sẽ subscribe vào observable được truyền vào.
// 8. toPromise() (ko nên sử dụng)
