const express = require('express');
const app = express();
const path = require('path')

const connectDB= require ("./config/db");
connectDB();

//init middleware
app.use(express.json({extended:false}));





app.use('/api/users',require('./routes/api/users'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/post',require('./routes/api/post'));
app.use('/api/auth',require('./routes/api/auth'));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*',(req, res) => {
        res.sendFile(path.resolve(_dirname,'client','build','index.html'))
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on Port ${PORT}`));

