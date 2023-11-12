import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import MySwal from '../../utils/MySwal'

const Menu = () => {
    const sw = new MySwal()
    const [isLoading, setIsLoading] = useState(true)
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({
        idMenu: '',
        namaMenu: '',
        hargaMenu: '',
    })

    const getData = useCallback(async () => {
        setIsLoading(false)
        await axios.get('http://localhost:8001/api/menuList')
        .then(({data}) => {
            setData(data.dataRec.map((item) => ({
                idMenu: item.id_menu,
                nama: item.nama_menu, 
                harga: item.harga_menu, 
            })))
            setColumns([{
                name: 'Nama',
                selector: row => row.nama,
                sortable: true
            },
            {
                name: 'Harga',
                selector: row => row.harga,
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
    }, [setIsLoading])

    const handleClickModal = useCallback((data) => {
        setShowModal(prevState => {
            if(prevState === true){
                setForm({
                    idMenu: '',
                    namaMenu: '',
                    hargaMenu: '',
                })
            }else{
                if(data){
                    setForm({
                        idMenu: data.idMenu,
                        namaMenu: data.nama,
                        hargaMenu: data.harga,
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
            [name]: value
        }))
    }, [])

    const handleClickSave = useCallback(async () => {
        if(form.hargaMenu && form.namaMenu){
            sw.loading()
            if(form.idMenu){
                await axios.put('http://localhost:8001/api/updateMenu', {
                    id_menu: form.idMenu,
                    nama_menu: form.namaMenu,
                    harga_menu: form.hargaMenu,
                })
                .then((response) => {
                    if(response.data.code === '1'){
                        sw.success('Success Update Menu')
                        .then(() => {
                            handleClickModal()
                            setIsLoading(true)
                        })
                    }else{
                        sw.warning(response.data?.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }else{
                await axios.post('http://localhost:8001/api/createMenu', {
                    nama_menu: form.namaMenu,
                    harga_menu: form.hargaMenu,
                })
                .then((response) => {
                    if(response.data.code === '1'){
                        sw.success('Success Create Menu')
                        .then(() => {
                            setIsLoading(true)
                        })
                    }else{
                        sw.warning(response.data?.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        }
    }, [form.hargaMenu, form.namaMenu, form.idMenu])

    const handleClickDelete = useCallback(async (data) => {
        sw.confirm('Apakah Anda Yakin Ingin Menghapus menu ini?')
        .then(async (res) => {
            if(res.isConfirmed){
                if(data.idMenu){
                    await axios.delete('http://localhost:8001/api/deleteMenu', {
                        params: {
                            id_menu: data.idMenu,
                        }
                    })
                    .then((response) => {
                        if(response.data.code === '1'){
                            sw.success('Success Delete Menu')
                            .then(() => {
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
        })
    }, [form.idMenu])

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
                            Menu Page
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
                <Modal.Header>Create New Menu</Modal.Header>
                <Modal.Body>
                    <Form.Group className='py-2'>
                        <Form.Label>
                            Nama Menu
                        </Form.Label>
                        <Form.Control value={form.namaMenu} name='namaMenu' type='text' placeholder='Masukkan Nama Menu' onChange={(e) => handleChange(e)}/>
                    </Form.Group>
                    <Form.Group className='py-2'>
                        <Form.Label>
                            Harga Menu
                        </Form.Label>
                        <Form.Control value={form.hargaMenu} type='number' name='hargaMenu' placeholder='Masukkan Harga Menu' onChange={(e) => handleChange(e)}/>
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

export default Menu