export const apiEndPoints = {
    BOOKING_INFORMATION:{
        GET_ALL: '/booking-informations',
        GET_TIME_BY_MONTH: (month) => `/booking-informations/month/${month}`,
        CREATE: '/booking-informations'
    }
}