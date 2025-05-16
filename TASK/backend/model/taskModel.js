
const mongoose=require('mongoose');
const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:''
        },
    priority:{ 
        type:String,
        required:true,
        enum:['High','Medium','Low']
    },
    completed:{
        type:Boolean,
        default:false
        },
    dueDate:{
        type:Date,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createAt:{
        type:Date,
        default:Date.now
    },
})
const Task=mongoose.model('Task',taskSchema)

module.exports=Task