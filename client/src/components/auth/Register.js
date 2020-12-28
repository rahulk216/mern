import React,{Fragment,useState} from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setformData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });
    const onChange = e =>setformData({...formData,[e.target.name]: e.target.value});
    const {name,email,password,password2}=formData;

    const onSubmit =async e =>{
        e.preventDefault();
        if (password!==password2) {
            console.log('password dont match')
        }
        else
        {
           const newUser={
               name,
               email,
               password
           }
           console.log(newUser)
           try {
               const config = {
                   headers: {
                       'Content-Type': 'application/json'
                   }
               }
               const body = JSON.stringify(newUser);
               console.log(body)
               const res=await axios.post('/api/users', body, config);
               console.log(res.data)
           } catch (error) {
               console.log('error kanro');
               console.log(error.response.data)
           }
        }
    };
    return (
        <Fragment>
         
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e =>onSubmit(e)}>
                <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    name="name" 
                    required
                    onChange={e=>onChange(e)} 
                />
                </div>
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
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    minLength="6"
                    value={password2}
                    onChange={e=>onChange(e)}  
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <a href="login.html">Sign In</a>
            </p>
      
        </Fragment>
    )
}
export default Register;