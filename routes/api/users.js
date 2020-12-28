const express= require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User.js');
const gravatar = require('gravatar');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//api/users

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please add valid email').isEmail(),
    check('password','please add password 6 or more characters').isLength({min:6})
],async(req,res)=>{
    console.log(req.body)
   

    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{name,email,password}=req.body;
   
    try{
     // check if user exists in database    
        let user=await User.findOne({email});

        if(user){
            res.status(400).json({error:[{msg:'user exists'}]});
       }
        const avatar =gravatar.url((email),{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user= new User({
            name,
            email,
            avatar,
            password
        })
   
    //get user gravatar
        const val=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,val)
        await user.save();
    //encrypt password
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.get('jwtsecret'),
            {expiresIn : 360000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            }
        );



        
    //jwt






    }catch(err){
        console.log(err)
        res.status(400).send('Server error');
    }

});

module.exports= router;