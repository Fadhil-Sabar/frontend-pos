import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import MySwal from "../../utils/MySwal"
import { useSelector } from "react-redux"

const Create = () => {
    const navigate = useNavigate()
    const sw = new MySwal()
    const {idTransaksi} = useParams()
    const auth = useSelector(({Auth}) => Auth)
    const [optionMenu, setOptionMenu] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [form, setForm] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const getData = useCallback(async (edit) => {
        setIsLoading(false)

        await axios.get('http://localhost:8001/api/menuList')
        .then(({data}) => {
            setOptionMenu(data.dataRec.map(item => ({title: item.nama_menu, value: item.id_menu, harga: item.harga_menu})))
            if(edit){
                getDataTransaksi(data.dataRec)
            }
        })

    }, [])

    const handleChange = useCallback((e, i) => {
        const {name, value} = e.target
        setForm(prevState => {
            let find = prevState.findIndex((d, idx) => i === idx)
            prevState[find] = {
                ...prevState[find],
                [name]: value
            }
            return [
                ...prevState,
            ]
        })
    }, [setForm])

    const handleClickRemoveItem = useCallback((index) => {
        setForm(prevState => {
            let find = prevState.findIndex((d, idx) => index === idx)
            prevState = prevState.filter((d,i) => i !== find)
            return [
                ...prevState
            ]
        })
    }, [])

    const handleClickAddItem = useCallback(() => {
        setForm(prevState => {
            return [
                ...prevState,
                {
                    idTransaksiDetail: '',
                    namaKasir: '',
                    idMenu: '',
                    namaMenu: '',
                    tglTransaksi: '',
                    hargaMenu: 0,
                    quantity: 0,
                }
            ]
        })
    }, [])

    const handleSelectOption = useCallback((e, i) => {
        const find = optionMenu.find(opt => opt.title === e.target.value)
        if(find){
            handleChange({
                target: {name: 'idMenu', value: find.value}
            }, i)
            handleChange({
                target: {name: 'hargaMenu', value: find.harga}
            }, i)
        }
    }, [handleChange, optionMenu])

    const summaryHarga = useMemo(() => {
        return form.reduce((acc, curr) => {
            return acc+=curr.hargaMenu * curr.quantity
        }, 0)
    }, [form])

    const handleClickSave = useCallback(async () => {
        if(idTransaksi){
            await axios.put('http://localhost:8001/api/updateTransaksi', {
                id_transaksi: idTransaksi,
                data: form.map(item => ({
                    idMenu: item.idMenu,
                    quantity: item.quantity,
                    hargaMenu: item.hargaMenu
                })),
                createdBy: auth.username
            })
            .then((response) => {
                if(response.data.code === '1'){
                    sw.success('Success Update User')
                    .then(() => {
                        navigate('/transaksi')
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
            await axios.post('http://localhost:8001/api/createTransaksi', {
                data: form.map(item => ({
                    idMenu: item.idMenu,
                    quantity: item.quantity,
                    hargaMenu: item.hargaMenu
                })),
                createdBy: auth.username
            })
            .then((response) => {
                if(response.data.code === '1'){
                    sw.success('Success Create User')
                    .then(() => {
                        setForm([])
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
    }, [idTransaksi, form, auth.username, sw, navigate])

    const getDataTransaksi = useCallback(async (optMenu) => {
        await axios.get('http://localhost:8001/api/transaksiList',{
            params: {
                id_transaksi: idTransaksi
            }
            })
            .then(({data}) => {
                setForm(data.dataRec[0].detail_transaksi.map((det) => {
                    const findMenu = optMenu.find(opt => opt.nama_menu === det.nama_menu)
                    return {
                        idTransaksiDetail: det.id_transaksi_detail,
                        namaKasir: '',
                        idMenu: findMenu?.id_menu,
                        namaMenu: det.nama_menu,
                        tglTransaksi: '',
                        hargaMenu: det.harga_menu,
                        quantity: det.quantity,
                    }
                }))
            })
    }, [idTransaksi, optionMenu])

    useEffect(() => {
        if(isLoading){
            getData()
        }
    }, [isLoading, getData])

    useEffect(() => {
        if(window.location.pathname.includes('update')) getData(true)
    }, [])

    return (
        <>
            <Card>
                <Card.Header>
                    <Row>
                        <Col className='d-flex justify-content-start'>
                            New Transaksi Page
                        </Col>
                        <Col className='d-flex justify-content-end'>
                            <Button variant='outline-primary' onClick={() => handleClickAddItem()}>
                                Tambah Item
                                <i className="bi bi-plus"></i>
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            {
                                form.map((item, index) => {
                                    return (
                                        <>
                                            <Row className='d-flex align-content-center'>
                                                <Col md={7}>
                                                    <Form.Group className='py-2'>
                                                        <Form.Control value={form[index].namaMenu} type='text' list="optionMenu" name='namaMenu' placeholder='Nama Menu' onChange={(e) => handleChange(e, index)} onSelect={(e) => handleSelectOption(e, index)}/>
                                                        <datalist id="optionMenu">
                                                            {
                                                                optionMenu.map(item => (
                                                                    <option value={item.title} title={item.value}/>
                                                                ))
                                                            }
                                                        </datalist>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Group className='py-2'>
                                                        <Form.Control value={form[index].quantity} max={1000} type='number' name='quantity' placeholder='Quantity' onChange={(e) => handleChange(e, index)}/>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Group className='py-2'>
                                                        <Form.Control value={form[index].hargaMenu} max={1000} type='number' name='hargaMenu' placeholder='Harga Menu' disabled/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className='py-2' md={1}>
                                                    <Button variant='outline-danger' onClick={() => handleClickRemoveItem(index)}>
                                                        <i className="bi bi-dash-circle"></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-end">
                        <Col className="d-flex justify-content-end" md={2}>
                            <Form.Group className='py-2'>
                                <Form.Control value={summaryHarga} max={1000} type='number' name='quantity' placeholder='Summary' disabled />
                            </Form.Group>
                        </Col>
                        <Col md={1}></Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <Col className='d-flex justify-content-end'>
                        <Button variant='outline-danger' type='button' className='mx-3' onClick={() => navigate('/transaksi')}>
                            Cancel
                        </Button>
                        <Button variant='outline-primary' type='button' className='' onClick={() => handleClickSave()}>
                            Save
                        </Button>
                    </Col>
                </Card.Footer>
            </Card>
        </>
    )
}

export default Create