import { InMemoryDB } from "./db";

const db = new InMemoryDB();

console.log("=========SET and GET============");
// SET and GET
db.set('name', 'John Doe');
console.log(db.get('name')); // Output: John Doe
console.log("=====================");

console.log("=========INCR and DECR============");
// INCR and DECR
db.set('counter', 10);
console.log(db.incr('counter')); // Output: 11
console.log(db.decr('counter')); // Output: 10
console.log("=====================");

console.log("=========EXISTS============");
// EXISTS
console.log(db.exists('name')); // Output: true
console.log(db.exists('unknownKey')); // Output: false
console.log("=====================");

console.log("=========EXPIRE============");
// EXPIRE
db.set('expiringKey', 'expiringValue');
db.expire('expiringKey', 10);
console.log(db.get('expiringKey')); // Output: value
setTimeout(() => {
  console.log("expiringKey : ", db.get('expiringKey')); // Output: null
}, 10000);

db.set('expiringKey2', 'expiringValue2');
db.expire('expiringKey2', 5);
console.log(db.get('expiringKey2')); // Output: value
setTimeout(() => {
  console.log("expiringKey2 : ", db.get('expiringKey2')); // Output: null
}, 10000);
console.log("=====================");