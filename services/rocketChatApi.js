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
        throw new Error(response.status)
    }
}

export const getJoinedChannels = async (baseUrl, authToken, userId) => {
    const joinedChannelsUrl = prepareBaseUrl(baseUrl) + '/channels.list.joined'

    const response = await axios.get(joinedChannelsUrl, {
        headers: {
            'X-Auth-Token': authToken,
            'X-User-Id': userId,
        }
    })

    if (response.status == 200) {
        const channels = response.data.channels
        return channels.map((channel) => ({ id: channel._id, name: channel.fname }))
    } else {
        console.log(response)
        throw new Error(response.status)
    }
}
