export const apiEndPoints = {
    ROLES: {
        GET_ALL: '/roles',
    },
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        EDIT_ROLE: '/users',
    },
    BOOKING_INFORMATION: {
        GET: (id) => `booking-informations/${id}`,
        GET_ALL: '/booking-informations',
        GET_TIME_BY_MONTH: (month) => `/booking-informations/month/${month}`,
        GET_CURRENT_BOOKING: '/booking-informations/current',
        CREATE: '/booking-informations',
        EDIT_STATUS: (id, status) => `/booking-informations/${id}/${status}`,
        EDIT: (id) => `/booking-informations/${id}`,
    },
    BRANCH: {
        GET_ALL: (includeDeleted) => `/branches/${includeDeleted ? 'true' : 'false'}`,
        GET_ALL_NAME: '/branches/name',
        CREATE: '/branches',
        EDIT: (id) => `/branches/${id}`,
        DELETE: (id) => `/branches/${id}`,
    },
    DASHBOARD: {
        ADMIN: '/dashboard/statistic',
    },
    DISABLED_TIME: {
        GET_BY_MONTH: (year, month, branchId) => `/disabled-booking-times/${year}/${month}/${branchId}`,
        CREATE: '/disabled-booking-times',
        DELETE: (time) => `/disabled-booking-times/${time}`,
    },
    FOOD: {
        GET_ALL: '/foods',
        GET_BY_ID: (id) => `/foods/${id}`,
        CREATE: '/foods',
        EDIT: (id) => `/foods/${id}`,
        DELETE: (id) => `/foods/${id}`,
    },
    FOOD_OPTION: {
        CREATE: '/food-options',
        EDIT: (id) => `/food-options/${id}`,
        DELETE: (id) => `/food-options/${id}`,
    }
}