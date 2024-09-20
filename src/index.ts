import { InMemoryDB } from "./db";

const db = new InMemoryDB();

// SET and GET
db.set('name', 'John Doe');
console.log(db.get('name')); // Output: John Doe

// INCR and DECR
db.set('counter', 10);
console.log(db.incr('counter')); // Output: 11
console.log(db.decr('counter')); // Output: 10

// EXISTS
console.log(db.exists('name')); // Output: true
console.log(db.exists('unknownKey')); // Output: false

// FLUSHALL
db.flushAll();
console.log(db.get('name')); // Output: null