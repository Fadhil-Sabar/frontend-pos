import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import MySwal from '../../utils/MySwal'
import { useSelector } from 'react-redux'

const User = () => {
    const sw = new MySwal()
    const auth = useSelector(({Auth}) => Auth)
    const [isLoading, setIsLoading] = useState(true)
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({
        idUser: '',
        namaUser: '',
        username: '',
        level: auth.level + 1,
    })

    const getData = useCallback(async () => {
        setIsLoading(false)
        await axios.get('http://localhost:8001/api/userList')
        .then(({data}) => {
            setData(data.dataRec.map((item) => ({
                idUser: item.id_user,
                namaUser: item.nama, 
                username: item.username,
                level: item.level, 
            })))
            setColumns([{
                name: 'Nama',
                selector: row => row.namaUser,
                sortable: true
            },
            {
                name: 'Username',
                selector: row => row.username,
                sortable: true
            },{
                name: 'Level',
                selector: row => row.level,
                sortable: true
            },{
                name: 'Actions',
                cell: row =>  (<>
                    <Button variant='outline-warning' onClick={() => handleClickModal(row)}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant='outline-danger' onClick={() => handleClickDelete(row)}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </>)
            }])
        })
        .catch(err => {
            sw.warning(err.response?.data?.msg)
        })
    }, [setIsLoading])

    const handleClickModal = useCallback((data) => {
        setShowModal(prevState => {
            if(prevState === true){
                setForm(prevState => ({
                    ...prevState,
                    idUser: '',
                    namaUser: '',
                    username: '',
                }))
            }else{
                if(data){
                    setForm({
                        idUser: data.idUser,
                        namaUser: data.namaUser,
                        username: data.username,
                        level: data.level,
                    })
                }
            }
            return !prevState
        })
    }, [])

    const handleChange = useCallback((e) => {
        const {name, value} = e.target
        setForm(prevState => ({
            ...prevState,
            [name]: name === 'level' && value < auth.level ? auth.level + 1 : value
        }))
    }, [auth.level])

    const handleClickSave = useCallback(async () => {
        if(form.level && form.namaUser){
            sw.loading()
            if(form.idUser){
                await axios.put('http://localhost:8001/api/updateUser', {
                    id_user: form.idUser,
                    name: form.namaUser,
                    username: form.username,
                    level: form.level,
                })
                .then((response) => {
                    if(response.data.code === '1'){
                        sw.success('Success Update User')
                        .then(() => {
                            handleClickModal()
                            setIsLoading(true)
                        })
                    }else{
                        sw.warning(response.data?.msg)
                    }
                })
                .catch(err => {
                    sw.warning(err.response?.data?.msg)
                    console.log(err)
                })
            }else{
                await axios.post('http://localhost:8001/api/createUser', {
                    name: form.namaUser,
                    username: form.username,
                    level: form.level,
                })
                .then((response) => {
                    if(response.data.code === '1'){
                        sw.success('Success Create User')
                        .then(() => {
                            handleClickModal()
                            setIsLoading(true)
                        })
                    }else{
                        sw.warning(response.data?.msg)
                    }
                })
                .catch(err => {
                    sw.warning(err.response?.data?.msg)
                    console.log(err)
                })
            }
        }
    }, [form.level, form.namaUser, form.idUser, form.username])

    const handleClickDelete = useCallback(async (data) => {
        sw.confirm('Apakah Anda Yakin Ingin Menghapus user ini?')
        .then(async (res) => {
            if(res.isConfirmed){
                if(data.idUser){
                    await axios.delete('http://localhost:8001/api/deleteUser', {
                        params: {
                            id_user: data.idUser,
                        }
                    })
                    .then((response) => {
                        if(response?.data?.code === '1'){
                            sw.success('Success Delete User')
                            .then(() => {
                                setIsLoading(true)
                            })
                        }
                    })
                    .catch(err => {
                        sw.warning(err.response?.data?.msg)
                        console.log(err)
                    })
                }
            }
        })
    }, [form.idUser])

    useEffect(() => {
        if(isLoading){
            getData()
        }
    }, [isLoading, getData])


    return (
        <div>
            <Card>
                <Card.Header>
                    <Row>
                        <Col className='d-flex justify-content-start'>
                            User Page
                        </Col>
                        <Col className='d-flex justify-content-end'>
                            <Button variant='outline-primary' onClick={() => handleClickModal()}>
                                Create New
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <DataTable
                        columns={columns}
                        data={data}
                        className='table'
                        customStyles={{
                            table: {
                                style: {
                                    border: '1px solid #dddddd',
                                    borderCollapse: 'collapse',
                                }
                            },
                            headCells:{
                                style:{
                                    justifyContent: 'center',
                                    border: '1px solid #dddddd'
                                }
                            },
                            cells: {
                                style: {
                                    justifyContent: 'center'
                                    // border: '1px solid #dddddd',
                                    // borderCollapse: 'collapse'
                                }
                            }
                        }}
                        pagination
                        responsive
                    />
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => handleClickModal()} centered>
                <Modal.Header>Create New User</Modal.Header>
                <Modal.Body>
                    <Form.Group className='py-2'>
                        <Form.Label>
                            Nama User
                        </Form.Label>
                        <Form.Control value={form.namaUser} name='namaUser' type='text' placeholder='Masukkan Nama User' onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group className='py-2'>
                        <Form.Label>
                            Username
                        </Form.Label>
                        <Form.Control value={form.username} type='text' name='username' placeholder='Masukkan Username' onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group className='py-2'>
                        <Form.Label>
                            Level
                        </Form.Label>
                        <Form.Control value={form.level} min={auth.level + 1} max={3} type='number' name='level' placeholder='Masukkan Level User' onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Col className='d-flex justify-content-end'>
                        <Button variant='outline-danger' type='button' className='mx-3' onClick={() => handleClickModal()}>
                            Cancel
                        </Button>
                        <Button variant='outline-primary' type='button' className='' onClick={() => handleClickSave()}>
                            Save
                        </Button>
                    </Col>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default User