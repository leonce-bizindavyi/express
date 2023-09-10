import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const initialValues = {
        password: "",
        username: ""
    }

    const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_API_URL}/auth`,data).then((response)=>{
            navigate('/')
          })
    }


    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required("You must input a Title !"),
        password: Yup.string().min(4).max(20).required(),
    })
    return (
        <div className='createPostPage'>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='formContainer'>
                    <label>Username:</label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                        autoComplete='off' 
                        id="inputCreatePost" 
                        name="username" 
                        placeholder="(Ex. Title...)" 
                    />
                <label>Password : </label>
                <ErrorMessage name="password" component="span"/>
                <Field 
                    autoComplete='off' 
                    id="inputCreatePost" 
                    name="password" 
                    placeholder="(Ex. Post... )"
                 />
                
                <button type='submit'>Register</button>
            </Form>
            </Formik>
        </div>
  )
}

export default Register