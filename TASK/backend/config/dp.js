const mongoose=require('mongoose')

const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://arpitbabu802:AdJhBSl6iTiCPyvg@cluster0.6trhdxr.mongodb.net/TASKMANAGER', {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('Connected to DB')
    })
    .catch((error)=>{
        console.log(error);
    })
}
module.exports=connectDB