const mongoose = require('mongoose');
const Joi = require('joi');


const studentSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true
    },
    studentAddress:
    {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true
    },
    grade:
    {
        type: String,
        required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }

});

const Student = mongoose.model('Student', studentSchema);

const validateAdd = (body) => {
    let schema = {
        name: Joi.string().required(),
        studentAddress: Joi.string().required(),
        stage: Joi.string().required(),
        grade: Joi.string().required(),
        user: Joi.string().length(24).required(),       
    };

    return Joi.validate(body, schema);
}

const validateUpdate = (body) => {
    let schema = {
        name: Joi.string().optional(),
        studentAddress: Joi.string().optional(),
        stage: Joi.string().optional(),
        grade: Joi.string().optional(),
    };

    return Joi.validate(body, schema);
}


const addStudent = async (input) => {
    
    let body = input.body;
    body.user = input.user._id;
    const { error } = validateAdd(body);
    if (error) return (error.details[0]);

    let newStudent = new Student(body)

    newStudent = await newStudent.save();

    return newStudent;
}
const updateStudent = async (input) => {

    let {id} = input.params;
    let body = input.body;
    const { error } = validateUpdate(body);
    if (error) return (error.details[0]);

    let student = await Student.find({_id: id});
    if(student.length == 0) return "incorrect ID";
    else if(student[0].user == input.user._id){
    let updatedStudent = await Student.findByIdAndUpdate(id, body, {new: true})
    return updatedStudent;
    }
    else{
        return "Access Denied you didn't create this document ";
    }
    
}

const deleteStudent = async (input) => {
    let { id } = input.params;

    let student = await Student.find({_id: id});
    if(student.length == 0) return "incorrect ID";
    else if(student[0].user == input.user._id){
    let deletedStudent = await Student.findByIdAndDelete(id)
    return deletedStudent;
    }
    else{
        return "Access Denied you didn't create this document ";
    }
}
const getAll = async (input) => {
    return await Student.find();
}

async function getStudent(input) {

    let student = await Student.findById(input.params.id);
    if(student == null) return 'Incorrect ID';
    return (student);
}

module.exports = {
    Student,
    addStudent,
    updateStudent,
    deleteStudent,
    getAll,
    getStudent
}
