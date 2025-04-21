import express from 'express'
import cors from 'cors'

import client from "./redisClient.js"
import cargarCapitulos from './cargarCapitulos.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/capitulos', async (req, res) => {
    try {
        const keys = await client.keys('capitulo:*')
        const capitulos = []
        const horaActual = Date.now()   

        for (const key of keys) {
            const capitulo = await client.get(key)
            const capituloData = JSON.parse(capitulo)

            if ((capituloData.estado === 'alquilado' || capituloData.estado === 'reservado') && horaActual > capituloData.horaFin) {
                capituloData.estado = 'disponible'
                capituloData.horaFin = 0
                await client.set(key, JSON.stringify(capituloData))
            }

            capitulos.push(capituloData)
        }
    
        res.status(200).json(capitulos)

    } catch (err) {
        console.error('Error al obtener capítulos', err)
        res.status(500).json({ error: 'Error al obtener capítulos' })
    }
})

app.get('/capitulos/:idCapitulo', async (req, res) => {
    const { idCapitulo } = req.params

    try {
        const capitulo = await client.get(`capitulo:${idCapitulo}`)

        if (!capitulo) {
            return res.status(404).json({ error: 'Capítulo no encontrado' })
        }

        const capituloData = JSON.parse(capitulo)

        res.status(200).json(capituloData)

    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el capitulo' })
    }
})

app.put('/capitulos/pago/:idCapitulo', async (req, res) => {

    const { idCapitulo } = req.params
    const { confirmarPago } = req.body

    if (confirmarPago === undefined) {
        return res.status(400).json({ error: 'El campo confirmarPago es requerido' })
    }

    try {
        const capitulo = await client.get(`capitulo:${idCapitulo}`)

        if (!capitulo) {
            return res.status(404).json({ error: 'Capítulo no encontrado' })
        }

        const capituloData = JSON.parse(capitulo)
        const horaActual = Date.now()

        if (capituloData.estado === 'reservado' && capituloData.horaFin > horaActual) {
            if (!confirmarPago) {
                return res.status(400).json({ error: 'El capítulo ya está reservado, esperar los 4 minutos para volver a reservar' })
            }
        }

        if (capituloData.estado === 'alquilado' && capituloData.horaFin > horaActual) {
            return res.status(400).json({ error: 'El capítulo ya está alquilado' })
        }

        if (confirmarPago) {
            capituloData.estado = 'alquilado'
            capituloData.horaFin = Date.now() + 24 * 60 * 60 * 1000
        } else {
            capituloData.estado = 'reservado'
            capituloData.horaFin = Date.now() + 4 * 60 * 1000
        }

        await client.set(`capitulo:${idCapitulo}`, JSON.stringify(capituloData))

        res.status(200).json(capituloData)

    } catch (err) {
        console.error('Error al actualizar el pago', err)
        res.status(500).json({ error: 'Error al actualizar el pago' })
    }
})


const main = async () => {
    try {
        await client.connect()
        await cargarCapitulos()

        app.listen(3000, () => {
            console.log('Servidor corriendo en el puerto 3000')
        })
    } catch(err) {
        console.error('Error al iniciar el servidor', err)
    }

}

main()
