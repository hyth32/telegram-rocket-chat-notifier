import { configDotenv } from 'dotenv'
import axios from 'axios'

configDotenv()

export class Auth {
    constructor(baseUrl) {
        this.baseUrl = baseUrl + 'api/v1'
        this.name = null
        this.userId = null
        this.authToken = null
    }

    async login(username, password) {
        try {
            const url = this.baseUrl + '/login'

            const payload = {
                user: username,
                password: password,
            }
            
            const response = await axios.post(url, payload)

            if (response.status == 200) {
                this.name = response.data.data.me.name
                this.userId = response.data.data.userId
                this.authToken = response.data.data.authToken

                return [this.name, this.userId, this.authToken]
            }
        } catch (error) {
            console.error(error)
        }
    }
}
