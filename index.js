const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const AuthRouter =require('./Routes/AuthRouter');
const ProductRouter =require('./Routes/ProductRouter');
const ExpenseRouter =require('./Routes/ExpenseRouter');
const cors=require('cors');
const ensureAunthenticated = require('./MiddleWares/Auth');
require('dotenv').config();
require('./Models/db');
const PORT=process.env.PORT || 8080;
app.get('/ping',(req,res)=>{
    res.send('Neha');
})
app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);
app.use('/expenses',ensureAunthenticated,ExpenseRouter);
app.listen(PORT,()=>{
   console.log(`server is running on ${PORT}`);
})