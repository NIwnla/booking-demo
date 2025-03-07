
export const routeNames = {
    index: "/",
    login: "/login",
    callback: "/callback",
    notFound: "/404",
    booking: {
        branchChoose: '/booking/branches',
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
        branchChoose: '/disable-time/branches',
        calendar: '/disable-time/calendar',
    },
    food: {
        management: '/foods/management'
    },
    foodOption: {
        management: '/food-options/management/'
    },
    recruitInformation: {
        signUp: '/recruit/sign-up',
        management: 'recruit/management',
    },
    driver: {
        management: '/drivers/management',
    },
    deliveryInformation: {
        management: '/delivery-informations/management',
        create: '/delivery-informations/create',
    },
    category: {
        management: '/categories/management',
    },
    foodMenu: {
        main: '/food-menu',
        menu: '/food-menu/categories',
        detailed: {
            fromMain: '/food-menu/detail/',
            fromMenu: '/food-menu/categories/detail/'
        },
        myCart: '/food-menu/my-cart',
        orderInfo: '/food-menu/order-info',
        searchResult: '/food-menu/search',
    },
    reservation: {
        main: '/reservation',
        form: '/reservation/form',
    },
    career: {
        main: '/career',
        management: '/career/management',
        findJobs: '/career/find',
        about: '/career/about',
        detail: {
            admin: '/career/detail/admin/:id',
            default: '/career/detail/:id'
        },
        create: '/career/create/',
    },
}