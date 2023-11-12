import React, { useCallback, useEffect, useState } from 'react'
import { Card, Col, Row, Button, Modal } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import MySwal from '../../utils/MySwal'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Transaksi = () => {
    const sw = new MySwal()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState([
        {
            idTransaksiDetail: '',
            namaKasir: '',
            idMenu: '',
            namaMenu: '',
            tglTransaksi: '',
            quantity: 0
        }
    ])

    const getData = useCallback(async () => {
        setIsLoading(false)
        await axios.get('http://localhost:8001/api/transaksiList')
        .then(({data}) => {
            setData(data.dataRec.map((item) => ({
                idTransaksi: item.id_transaksi,
                noAntrian: item.no_antrian,
                namaKasir: item.nama_kasir, 
                tglTransaksi: item.tgl_transaksi,
            })))
            setColumns([{
                name: 'Nomor Antrian',
                selector: row => row.noAntrian,
                sortable: true
            },
            {
                name: 'Nama Kasir',
                selector: row => row.namaKasir,
                sortable: true
            },{
                name: 'Tanggal Transaksi',
                selector: row => row.tglTransaksi,
                sortable: true
            },{
                name: 'Actions',
                cell: row =>  (<>
                    <Button variant='outline-warning' onClick={() => navigate(`update/${row.idTransaksi}`)}>
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
                    id_transaksi: '',
                    noAntrian: '',
                    namaKasir: '',
                    tglTransaksi: '',
                }))
            }else{
                if(data){
                    setForm({
                        id_transaksi: '',
                        noAntrian: '',
                        namaKasir: '',
                        tglTransaksi: '',
                    })
                }
            }
            return !prevState
        })
    }, [])

    const handleClickSave = useCallback(async () => {
        if(form.namaUser){
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
    }, [])

    const handleClickDelete = useCallback(async (data) => {
        console.log("🚀 ~ file: index.js:142 ~ handleClickDelete ~ data:", data)
        sw.confirm('Apakah Anda Yakin Ingin Menghapus transaksi ini?')
        .then(async (res) => {
            if(res.isConfirmed){
                if(data.idTransaksi){
                    await axios.delete('http://localhost:8001/api/deleteTransaksi', {
                        params: {
                            id_transaksi: data.idTransaksi,
                        }
                    })
                    .then((response) => {
                        if(response?.data?.code === '1'){
                            sw.success('Success Delete Transaksi')
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
    }, [])

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
                            Transaksi Page
                        </Col>
                        <Col className='d-flex justify-content-end'>
                            <Button variant='outline-primary' onClick={() => navigate('create')}>
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
                <Modal.Header>Create New Transaksi</Modal.Header>
                <Modal.Body>
                    <Col>
                    </Col>
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

export default Transaksi