export const initialState = {
    Auth: {
        username: '',
        level: 0
    },
    RouteList: [
        {path: '/dashboard', element: 'DashboardPage', component: './pages/DashboardPage', title: 'Dashboard', icon: 'speedometer2'},
        {path: '/transaksi', element: 'Transaksi', component: './pages/Transaksi', title: 'Transaksi', icon: 'cart-fill'},
        {path: '/transaksi/create', element: 'Create', component: './pages/Transaksi/Create', title: 'Create Transaksi', icon: 'cart-fill', child: true},
        {path: '/transaksi/update/:idTransaksi', element: 'Create', component: './pages/Transaksi/Create', title: 'Create Transaksi', icon: 'cart-fill', child: true},
        {path: '/user', element: 'User', component: './pages/User', title: 'User', icon: 'people'},
        {path: '/menu', element: 'Menu', component: './pages/Menu', title: 'Menu', icon: 'list'}
    ]
}

export const reducer = (state = initialState, {type, payload}) => {
    switch(type){
        case 'SET_AUTH' : 
            return {
                ...initialState,
                Auth: {
                    ...payload
                }
            }
        case 'INIT': 
            return {
                ...initialState
            }
        default: return {...state}
    }
}