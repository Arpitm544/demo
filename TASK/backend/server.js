const express=require('express')
const cors=require('cors');
const connectDB = require('./config/dp');
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');
// const dotenv=require(dotenv)

// //Load enviroment variables from .env file
// dotenv.config();

const app=express();
const port=process.env.PORT || 4000

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//contect to DB
connectDB() 

app.get('/',(req,res)=>{
   res.send('Api working')
})

app.use('/api/users',userRouter)

app.use('/api/tasks',taskRouter)

app.listen(port,()=>{
  console.log(`server is started on http://localhost:${port}`)
})