const express = require('express');
const app = express();


const connectDB= require ("./config/db");
connectDB();

//init middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send("API running"));

const PORT = process.env.PORT || 5000;

app.use('/api/users',require('./routes/api/users'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/post',require('./routes/api/post'));
app.use('/api/auth',require('./routes/api/auth'));


app.listen(PORT,()=>console.log(`Server started on Port ${PORT}`));

