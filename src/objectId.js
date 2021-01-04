const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const id = new ObjectId();

console.log(id);
console.log(id.getTimestamp());
console.log(ObjectId.isValid('1234'));
