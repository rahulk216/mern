import axios from 'axios'
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST,  GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';

//get posts

export const getPosts = () => async dispatch => {

    try {
        const res =await axios.get('/api/post');
        console.log(res.data)
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const getPost = id => async dispatch => {

    try {
        const res =await axios.get(`/api/post/${id}`);
        console.log(res.data)
        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const addLike = postid => async dispatch => {

    try {
        const res =await axios.put(`/api/post/like/${postid}`);
        console.log(res.data)
        dispatch({
            type: UPDATE_LIKES,
            payload: { postid, likes: res.data }
        })
    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const removeLike = postid => async dispatch => {

    try {
        const res =await axios.put(`/api/post/unlike/${postid}`);
        console.log(res.data)
        dispatch({
            type: UPDATE_LIKES,
            payload:  { postid, likes: res.data }
        })
    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const deletePost = postid => async dispatch => {

    try {
        await axios.delete(`/api/post/${postid}`);
       
        dispatch({
            type: DELETE_POST,
            payload:  postid
        })

        dispatch(setAlert('post removed', 'success'));

    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post/`, formData, config);
       
        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post Added', 'success'));

    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}


export const addComment = (postId,formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post/comment/${postId}`, formData, config);
       
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment Added', 'success'));

    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}

export const deleteComment = (postId,commentId) => async dispatch => {
   
    try {
        const res = await axios.delete(`/api/post/comment/${postId}/${commentId}`);
       
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('Comment Removed', 'success'));

    } catch (err) {
         dispatch({
            type: POST_ERROR,
            payload: { msg:err.response.statusText, status: err.response.status }
        })
    }

}