import React, { useCallback, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import MySwal from '../../utils/MySwal'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const SignInPage = () => {
    const sw = new MySwal()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const handleChange = useCallback((e) => {
        const {name, value} = e.target
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }))
    }, [])

    const handleClickSignIn = useCallback(async () => {
        if(form.username && form.password){
            sw.loading()
            await axios.post('http://localhost:8001/api/login', {
                username: form.username,
                password: form.password
            }).then(response => {
                if(response?.data?.code === '1'){
                    sw.close()
                    localStorage.setItem('token', response.data.dataRec)
                    sw.success('Success')
                    .then(() => {
                        navigate('/dashboard')
                    })
                }
            })
        }
    }, [form.password, form.username, navigate, sw])
    return (
        <div className='container d-flex justify-content-center align-items-center'>
            <div className='col-6 d-flex justify-content-center'>
                <Card 
                    className='mt-5 w-75 text-center mx-auto'
                    style={{
                        height: '80vh'
                    }}
                >
                    <Card.Body>
                        <Form.Group className='pt-2'>
                            <Form.Label>
                                Username
                            </Form.Label>
                            <Form.Control name='username' type='text' placeholder='Enter Username' onChange={(e) => handleChange(e)}/>
                        </Form.Group>
                        <Form.Group className='pt-2'>
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control name='password' type='password' placeholder='Enter Password' onChange={(e) => handleChange(e)}/>
                        </Form.Group>
                        <Button variant='outline-secondary' type='button' className='mt-3' onClick={() => handleClickSignIn()}>
                            Sign In
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default SignInPage