import client from "./redisClient.js"
import { capitulos } from "./capitulosArray.js"

const cargarCapitulos = async () => {
    try {
        const keys = await client.keys("capitulo:*")

        if (keys.length > 0) {
            console.log("Los capitulos ya están cargados en Redis")
            return
        }

        for (const capitulo of capitulos) {
            const capituloString = JSON.stringify(capitulo)
            await client.set(`capitulo:${capitulo.id}`, capituloString)
        }

        console.log("Capitulos cargados en Redis")
    } catch (err) {
        console.error("Error al cargar los capitulos", err)
    }
}

export default cargarCapitulos
