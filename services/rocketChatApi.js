import axios from 'axios'

const prepareBaseUrl = (url) => {
    url = url.replace(/\/$/, '')
    if (!url.endsWith('/api/v1')) {
        url += '/api/v1'
    }
    return url
}

export const login = async (baseUrl, username, password) => {
    const loginUrl = prepareBaseUrl(baseUrl) + '/login'
    const payload = { user: username, password }

    const response = await axios.post(loginUrl, payload)
    
    if (response.status == 200) {
        const { name, userId } = response.data.data
        const authToken = response.data.data.authToken

        return { name, userId, authToken }
    } else {
        console.error(response)
        throw new Error(`Ошибка входа: ${response.status}`)
    }
}
