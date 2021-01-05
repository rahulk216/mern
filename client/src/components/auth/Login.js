import React,{Fragment,useState} from 'react';
import {Link ,Redirect}from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';



const Login = (props) => {
    const [formData, setformData] = useState({
        email:'',
        password:'',
    });
    const onChange = e =>setformData({...formData,[e.target.name]: e.target.value});
    const {email,password}=formData;

    const onSubmit =async e =>{
        e.preventDefault();
            console.log('loggin in')
       props.login(email,password);
        
    };

    if(props.isAuthenticated)
    {
        return <Redirect to='/dashboard'/>
    }
    return (
        <Fragment>
         
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> SignIn to Your Account</p>
            <form className="form" onSubmit={e =>onSubmit(e)}>
               
                <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    name="email"
                    onChange={e=>onChange(e)}  
                />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={e=>onChange(e)} 
                />
                </div>
                
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Dont have an account? <Link to="/Register">Sign Up</Link>
            </p>
      
        </Fragment>
    )
};
login.propTypes={
    login : PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}
const mapStateToProps = state =>({
    isAuthenticated : state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login);