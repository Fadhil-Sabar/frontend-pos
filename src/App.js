import React, { Suspense, useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignInPage from './pages/Auth/SignInPage';
import BasePage from './pages/BasePage';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MySwal from './utils/MySwal';
import Splashscreen from './components/SplashScreen';

axios.interceptors.request.use(
  config => {
    const authToken = localStorage.getItem('token')

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  err => Promise.reject(err)
)

function App() {
  const routes = useSelector(({RouteList}) => (RouteList))
  const dataRoutes = configRoute(routes)
  const navigate = useNavigate()
  const sw = new MySwal()

  useEffect(() => {
    axios.interceptors.response.use(success => success, err => {
      if(err?.response?.status === 401) {
        navigate('/')
      }
      sw.warning(err?.response?.data?.msg || err.response?.msg || err?.message)
    })
  }, [])
  
  
  return (
    <div className="App" >
      <Suspense fallback={<Splashscreen/>}>
        <Routes>
          <Route exact path='/' element={<SignInPage />} />
          {
            dataRoutes.map((route, index) => {
              return <Route {...route} key={index} element={<BasePage route={route} />} />
            })
          }
        </Routes>
      </Suspense>
    </div>
  );
}

const configRoute = (data) => {
  const CR = [];
  data.map((route) => {
      // let C = route.component.split(".") ? route.component.split(".")[0] : route.component;
      return CR.push({
          ...route,
          element: React.lazy(() => import(`${route.component}`)),
      })
  })
  return CR
}

export default App;
