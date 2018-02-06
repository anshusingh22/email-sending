var mongoose = require('mongoose');
 
var studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
});
 
var Student = mongoose.model('Student', studentSchema);
 
module.exports = Student;
