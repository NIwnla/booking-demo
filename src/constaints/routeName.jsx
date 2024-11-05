
export const routeNames = {
    index: "/",
    login: "/login",
    callback: "/callback",
    notFound: "/404",
    booking: {
        branchChoose: '/booking/branchs',
        management: '/booking/management',
        calendar: '/booking/calendar',
        bookingPage: '/booking/slot',
        unavailable: '/booking/unavailable',
        edit: '/booking/edit/:id'
    },
    branch: {
        management: '/branches/management',
    },
    user: {
        management: '/users/management',
    },
    homepage: {
        admin: '/home/admin',
        branchManager: '/home/branch-manager',
        guest: '/home/guest',
    },
    disableTime: {
        branchChoose: '/disable-time/branchs',
        calendar: '/disable-time/calendar',
    },
    food: {
        management: 'foods/management'
    },
    foodOption: {
        management: 'food-options/management/:id'
    },
}