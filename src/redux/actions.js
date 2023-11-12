const init = (payload) => (dispatch, getState) => {
    dispatch({
        type: 'INIT',
        payload: payload
    })
}

const setAuth = (payload) => (dispatch, getState) => {
    dispatch({
        type: 'SET_AUTH',
        payload: payload
    })
}

const actions = {
    init,
    setAuth
}

export default actions