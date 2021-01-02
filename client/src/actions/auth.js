import axios from 'axios';
import { REGISTER_SUCCESS,REGISTER_FAIL } from './types';
import { setAlert } from './alert';

export const Register =({ name,email,password}) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringfy({
        name, 
        email,
        password
    })

    try {
        const res = await axios.post('./api/users', body,config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

    } catch (err) {
        const errors= err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}
