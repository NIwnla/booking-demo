
export const routeNames = {
    index: "/",
    landing: "/landing",
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
        information: '/users/information'
    },
    dashboard:{
        overview: '/dashboard/overview',
        branch: '/dashboard/branch',
        user: '/dashboard/user',
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
        management: '/recruit/management',
        detail: '/recruit/detail/'
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
        smsConfirm: '/food-menu/sms-confirm',
        searchResult: '/food-menu/search',
    },
    reservation: {
        main: '/reservation',
        form: '/reservation/form',
    },
    jobOffer: {
        management: '/job-offers/management',
        detail: '/job-offers/detail/',
        create: '/job-offers/create',
        edit: '/job-offers/edit/',
    },
    career: {
        main: '/career',
        findJobs: '/career/find',
        about: '/career/about',
        detail: '/career/detail/'
    },
    profile: {
        main: '/profile',
        edit: '/profile/edit',
        settings: '/profile/settings'
    },
    statistic: {
        main: '/statistic',
        booking: '/statistic/booking',
        delivery: '/statistic/delivery'
    },
}