/** RxJS Subject and Multicasting */

import { BehaviorSubject, of, ReplaySubject, Subject, timer } from 'rxjs';
import { finalize, switchMap, switchMapTo } from 'rxjs/operators';

// Subject: vừa có thể subscribe vừa có thể next(data)
// Nên khai báo dưới dạng private readonly: để hạn chế sự thay đổi dữ liệu khi không mong muốn

const createObserver = observer => ({
  next: val => console.log(`observer: ${observer}, val: ${val}`),
  error: err => console.log(observer, err),
  complete: () => console.log(observer, 'complete')
});

const subject = new Subject();

// UC1:
// const loadingSubject = new Subject();
// function getUsers() {
//   loadingSubject.next(true); // fake value đc trả về trước
//   return timer(3000).pipe(
//     switchMapTo(of("users")),
//     finalize(()=> loadingSubject.next(false))
//   )
// }

// // tại component:
// loadingSubject.subscribe(createObserver('component'));
// getUsers().subscribe();

const behaviorSubject = new BehaviorSubject([]);
behaviorSubject.subscribe(createObserver('A2'));
behaviorSubject.next([1]);
behaviorSubject.subscribe(createObserver('B2'));
behaviorSubject.next([2]);
console.log(behaviorSubject.value); // get final value
// Đối vs behaviorSubject thì giá trị khi subscribe có thể nhân đc một cách Sync. haviorSubject khác vs Subject ở chỗ nó có lưu trữ lại giá trị trước đó khi subscribe vô.
// // Vd:
// function hasPermission() {
//   let hasPermission = false;
//   hasPermission.subscribe(permission => hasPermission = permission)

//   return hasPermission;
// }

// ReplaySubject khác vs BehaviorSubject ở chỗ nó có thể replay lại giá trị với số  lượng đc chỉ định. Còn BehaviorSubject chỉ replay đc giá  trị cuối cùng
const replaySubject = new ReplaySubject();

// asObservable() : export ra cái gì sẽ được xem như một observable
