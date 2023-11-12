import React, { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import * as jwt from 'jwt-decode'
import moment from 'moment'
import './BasePage.css'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/actions'

const BasePage = ({route}) => {
    const [decryptedToken, setDecryptedToken] = useState({})
    const routes = useSelector(({RouteList}) => RouteList)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const navigateTo = useCallback((path) => {
        navigate(path)
    }, [navigate])

    useEffect(() => {
        try {
            const decode = jwt.jwtDecode(localStorage.getItem('token'), process.env.SALT);
            const expiredTime = new Date(decode.exp * 1000)
            const diffTime = moment(expiredTime).diff(moment.now(), 'minutes')
            dispatch(actions.setAuth({
                username: decode.username,
                level: decode.level
            }))

            setDecryptedToken({
                username: decode.username,
                level: decode.level,
                diffTime
            })
    
        } catch (error) {
            console.error(error);
        }
    }, [setDecryptedToken, dispatch])

    if(!localStorage.getItem('token') || decryptedToken.diffTime <= 0){
        return <Navigate to="/" />
    } 
    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
                    <div className='col d-flex justify-content-start'>
                        <a className="navbar-brand" href="/">Kafe in</a>
                    </div>
                    <div className='col d-flex justify-content-end'>
                        <div className="dropdown pt-3 pl-3 d-flex align-items-end">
                            <Link className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
                                <strong>mdo</strong>
                            </Link>
                            <ul className="dropdown-menu text-small shadow dropdown-menu-end">
                                <li><Link className="dropdown-item">Profile</Link></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><Link className="dropdown-item" onClick={() => {
                                    localStorage.removeItem('token')
                                }}>Sign out</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar App-header">
                        <div className="position-sticky">
                            <div className='col p-2'>
                                <ul className="nav nav-pills flex-column mb-auto">
                                    {routes.map((route, index) => {
                                        if(!route?.child) {return (
                                            <li key={index} className='nav-item py-2'>
                                                <div type="button" className={`nav-link ${window.location.pathname.includes(route.path) ? 'active' : ''}`} onClick={() => navigateTo(route.path)}>
                                                    <i className={`bi bi-${route.icon} pe-2`}></i>
                                                    {route.title}
                                                </div>
                                            </li>
                                        )}
                                    })}
                                </ul>
                            </div>
                        </div>
                    </nav>
                        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-2">
                            <route.element/>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BasePage