import axios from 'axios'
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from './types';

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
