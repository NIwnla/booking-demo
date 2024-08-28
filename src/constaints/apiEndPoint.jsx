export const apiEndPoints = {
    ROLES: {
        GET_ALL: '/roles',
    },
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        EDIT_ROLE: (id, role) => `/users/${id}/${role}`
    },
    BOOKING_INFORMATION: {
        GET_ALL: '/booking-informations',
        GET_TIME_BY_MONTH: (month) => `/booking-informations/month/${month}`,
        GET_CURRENT_BOOKING: (userId) => `/booking-informations/current/${userId}`,
        CREATE: '/booking-informations',
        EDIT: (id, status) => `/booking-informations/${id}/${status}`
    },
    BRANCH: {
        GET_ALL: (includeDeleted) => `/branchs/${includeDeleted ? 'true' : 'false'}`,
        CREATE: '/branchs',
        EDIT: (id) => `/branchs/${id}`,
        DELETE: (id) => `/branchs/${id}`,
    },
    DASHBOARD:{
        ADMIN: '/dashboard/statistic',
    },
    DISABLED_TIME:{
        GET_BY_MONTH : (year, month, branchId) => `/disabled-booking-times/${year}/${month}/${branchId}`,
        CREATE: '/disabled-booking-times',
        DELETE: (id) => `/disabled-booking-times/${id}`,
    }
}