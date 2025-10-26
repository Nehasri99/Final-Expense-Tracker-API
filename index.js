const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const AuthRouter =require('./Routes/AuthRouter');
const ExpenseRouter =require('./Routes/ExpenseRouter');
const userRoutes = require('./Routes/UserRoutes');
const cors=require('cors');
const BudgetRouter = require('./Routes/BudgetRouter');
const ensureAunthenticated = require('./Middlewares/Auth');
require('dotenv').config();
require('./Models/db');
const PORT=process.env.PORT || 8080;
app.get('/ping',(req,res)=>{
    res.send('Neha');
})
app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/expenses',ensureAunthenticated,ExpenseRouter);
app.use('/budgets', ensureAunthenticated, BudgetRouter);
app.use('/api/users', userRoutes);
app.listen(PORT,()=>{
   console.log(`server is running on ${PORT}`);
})