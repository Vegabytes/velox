export default [
    {
        path: "/login",
        name:"Login",
        component:()=> import('@/modules/login/pages/Login')
    },
    {
        path: "/create",
        name:"Create",
        component:()=> import('@/modules/login/pages/Create')
    },
]