const express= require('express');
const router=express.Router();
const {check,validationResult} = require('express-validator');
const request=require('request');
const config = require('config');
const Profile= require('../../models/Profile');
const User= require('../../models/User');
const Post= require('../../models/Post');
const auth= require('../../middleware/auth');

//api/profile

router.get('/me',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"});
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
});

router.post('/',
[
    auth,
    [
        check('status','Status is required').not().isEmpty(),
        check('skills','skills is required').not().isEmpty()
    ]
],async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.message+'hello')
        return res.status(400).json({errors: errors.array()})
    }
  
    const 
    {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin    
    } = req.body;

    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills) {
        profileFields.skills=skills.split(',').map(skills=>skills.trim());
    }
    profileFields.social={}
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(instagram) profileFields.social.instagram=instagram;
    console.log(profileFields)
     
    try {

            let profile=await Profile.findOne({ user:req.user.id })
           
            if(profile)
            {
                profile=await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
                );
                console.log(profile)
                return res.json(profile);
            }
            profile= new Profile(profileFields);
            await profile.save();
            console.log(profile)
            return res.json(profile)
    } catch (errors) {
        console.log(errors.message)
        return res.status(400).send('server error')
    }

});

//GET all profiles


router.get('/',async(req,res)=>{

    try {
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles) 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }


});

// get profile by user ID
router.get('/user/:user_id',async(req,res)=>{

    try {
        const profile=await Profile.findOne({ user: req.params.user_id }).populate('user',['name','avatar']);
       
        if(!profile)
        {
            return res.status(400).json({msg:"profile not found "})
        }
        res.json(profile) 
    } catch (error) {
        console.log(error.message);
        if(err.kind=='ObjectId')
        {
             return res.status(400).json({msg:"profile not found "})  
        }
        res.status(500).send('Server Error');
    }


});


//Delete user 

router.delete('/',auth,async(req,res)=>{

    try {
        //remove user posts
        await Post.deleteMany({user: req.user.id})
        //removes profile
        await Profile.findOneAndRemove({user: req.user.id});
        //removes user
        await User.findOneAndRemove({user: req.user.id});
        res.json({msg:'user deleted'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }


});

// PUT experience

router.put('/experience',[auth,[
    check('company',"company required").not().isEmpty(),
    check('title','Title required').not().isEmpty(),
    check('from','From required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array})
    }
    const {title,company,location,from,to,current,description}=req.body;

    const newExp={
        title,company,location,from,to,current,description
    }
    try {
        const profile=await Profile.findOne({ user: req.user.id});
        
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error');
    }
});

//delete experience from profile
//DeL

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try {
        const profile=await Profile.findOne({ user: req.user.id });
        const removeIndex=profile.experience
            .map(item=>item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
          res.status(500).send('server error');

    }
});

// PUT education

router.put('/education',[auth,[
    check('school',"school  required").not().isEmpty(),
    check('degree','degree required').not().isEmpty(),
    check('fieldOfStudy','fielf of study required').not().isEmpty(),
    check('from','From date required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array})
    }
    const {school,degree,fieldOfStudy,from,to,current,description}=req.body;

    const newEdu={
        school,degree,fieldOfStudy,from,to,current,description
    }
    try {
        const profile=await Profile.findOne({ user: req.user.id});
        
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error');
    }
});

//delete education from profile
//DeL

router.delete('/education/:edu_id',auth,async(req,res)=>{
    try {
        const profile=await Profile.findOne({ user: req.user.id });
        const removeIndex=profile.education
            .map(item=>item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
          res.status(500).send('server error');

    }
});

//GET github repos

router.get('/github/:username', async(req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:ascending&client_id=${config.get('githubclientid')}&client_secret=${config.get('githubsecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}
        };

        request(options,(error,response,body)=>{
           
            if(response.statusCode!==200)
            {
               return res.status(404).json({msg:"no github profile found"});
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
         console.log(error.message);
          res.status(500).send('server error');
    }
});
module.exports=router;