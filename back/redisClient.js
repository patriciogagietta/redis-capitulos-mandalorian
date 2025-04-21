import { createClient } from "redis"

const client = createClient({
    url: "redis://redis:6379"
})

export default client