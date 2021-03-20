import '../assets/css/login.css'
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client'
import {useHistory} from 'react-router-dom'

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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const HandleSubmit = (e) => {
    try {
      e.preventDefault();
      console.log(formData)
      const {loading, error, data} = useQuery(Login, {variables: {login: formData}});
      // setFormData({
      //   email: '',
      //   password: ''
      // })
      console.log(data, error)
    } catch (err) {
      console.log(err)
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
                          required autoFocus/>
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <div className="form-label-group">
                        <input 
                          type="password" 
                          id="inputPassword" 
                          className="form-control" 
                          placeholder="Password"
                          onChange={onChange}
                          name="password"
                          required/>
                        <label htmlFor="inputPassword">Password</label>
                      </div>

                      <button className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</button>
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