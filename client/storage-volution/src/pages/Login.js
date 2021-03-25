import '../assets/css/login.css'
import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';

const Login = gql`
  mutation login($login : UserLoginInput) {
    login(input: $login){
      access_token
      name
      role
    }
  }
`;

export default function LandingPage () {
  const history = useHistory()
  const [handleLogin, {data}] = useMutation(Login);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  console.log(formData)
  useEffect(() => {
    const {name, role, access_token} = localStorage
    if (name && role && access_token) {
      history.push('/main')
    }
  }, [history])

  useEffect(() => {
    if (data) {
      localStorage.setItem('access_token', data.login.access_token)
      localStorage.setItem('name', data.login.name)
      localStorage.setItem('role', data.login.role)
      history.push('/main')
    }
  }, [data])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(formData)
      if (!formData.email || !formData.password) throw ({})
      await handleLogin({variables: {login: formData}})
    } catch (err) {
      if (err.graphQLErrors) {
        toast.error(`❌ ${err.graphQLErrors[0].extensions.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(`❌ Email and Password are required`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }
  
  const onChange = e => {
    let {name, value} = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto">
                    <h3 className="login-heading mb-4">Welcome back!</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-label-group">
                        <input 
                          type="email" 
                          id="inputEmail" 
                          className="form-control" 
                          placeholder="Email address"
                          value={formData.email}
                          onChange={onChange}
                          name="email"
                          autoFocus/>
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <div className="form-label-group">
                        <input 
                          type="password" 
                          id="inputPassword" 
                          className="form-control" 
                          placeholder="Password"
                          value={formData.password}
                          onChange={onChange}
                          name="password"
                          />
                        <label htmlFor="inputPassword">Password</label>
                      </div>

                      <button 
                        className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2" 
                        type="submit"
                        >Sign in</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}