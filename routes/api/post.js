const express = require('express');
const router=express.Router();

const {check,validationResult} = require('express-validator');
const request=require('request');
const config = require('config');

const Post= require('../../models/Post');
const Profile= require('../../models/Profile');
const User= require('../../models/User');

const auth= require('../../middleware/auth');




//api/posts

//
router.post('/',[auth,[
    check('text','Text should not be empty').not().isEmpty(),
]],async(req,res)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
            
        const user =await User.findById(req.user.id).select("-password");
        console.log(user.name)
        const newPost=new Post(
            {
                text: req.body.text,
                name:user.name,
                avatar: user.avatar,
                user:req.user.id
            }
        )

        const post=await newPost.save();
        res.json(post)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
});

//GET all posts
router.get('/',auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({date: -1});
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
});

//GET posts based on user ID
router.get('/:_id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params._id);

        
        if(!post){
            return res.status(400).json({msg:"posts not found"});
        }
        res.json(post)
    } catch (error) {
        console.log(error.message);
         if(error.kind=='ObjectId'){
            return res.status(400).json({msg:"posts not found"});
        }
        res.status(500).send('server error');
    }
});

//DELETE POST

router.delete('/:post_id',auth,async(req,res)=>{
    try {
         const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
    } catch (error) {
        console.log(error.message);
         if(error.kind=='ObjectId'){
            return res.status(400).json({msg:"posts not found"});
        }
        res.status(500).send('server error');
    }
});


//PUT adding like
router.put('/like/:id',auth,async(req,res)=>{
     try {
         const post=await Post.findById(req.params.id);
         if(post.likes.filter(like => like.user.toString()===req.user.id).length > 0){
             return res.status(400).json({msg:"post already liked"});
         }
         post.likes.unshift({user:req.user.id});
         await post.save();
         res.json(post.likes);
     } catch (error) {
         console.log(error.message);
         res.status(500).send('server error');
     }
});

//PUT unlike 
router.put('/unlike/:id', auth,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
 
    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
 
    // remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );
 
    await post.save();
 
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//PUT add comment

router.post('/comment/:id',[auth,
[
    check('text','Text should not be empty').not().isEmpty(),
]],async(req,res)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
            
        const user =await User.findById(req.user.id).select("-password");
        console.log(user.name)
        const post=await Post.findById(req.params.id)
        const newComment=
            {
                text: req.body.text,
                name:user.name,
                avatar: user.avatar,
                user:req.user.id
            }
        post.comments.unshift(newComment)

        await post.save();
        res.json(post.comments)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
});

//DELETE comment
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
        try {
            //pull post
            const post= await Post.findById(req.params.id);
            //pull comment
            const comment=post.comments.find(comment=>comment.id===req.params.comment_id);

            if(!comment){
                return res.status(404).json({msg:'comment does not exist'});
            }
            if(comment.user.toString()!=req.user.id){
                return res.status(401).json({msg:'user not authorized'});
            }
            const removeIndex=post.comments
                .map(comment=>comment.user.toString())
                .indexOf(req.user.id);

            post.comments.splice(removeIndex,1);
            await post.save();
            res.json(post.comments);

        } catch (error) {
            console.log(error.message);
            res.status(500).send('server error');
        }

});

module.exports=router;