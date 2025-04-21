import { useEffect, useState } from 'react'

import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export const CapituloPago = ({ reservarEstado }) => {

    const [capitulo, setCapitulo] = useState(null)

    const {idCapitulo} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        let capituloActual = null

        if (!reservarEstado) {
            navigate('/')
            return
        }

        const obtenerCapitulo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/capitulos/${idCapitulo}`)
                setCapitulo(response.data)
                capituloActual = response.data

            } catch (error) {
                console.log('Error al obtener el capitulo', error)
            }
        }

        obtenerCapitulo()

        if (reservarEstado) {
            return () => {
                if (capituloActual && capituloActual.estado === "disponible") {
                    axios.put(`http://localhost:3000/capitulos/pago/${idCapitulo}`, {
                        confirmarPago: false
                    }).catch(error => console.log("Error al reservar el capítulo", error))
                }
            }
        }

    }, [idCapitulo, navigate])

    const confirmarPago = async (idCapitulo) => {
        try {
            await axios.put(`http://localhost:3000/capitulos/pago/${idCapitulo}`, {
                confirmarPago: true
            })

            navigate('/')
        } catch (error) {
            console.log('Error al confirmar el pago', error)
        }
    }

    if (!capitulo) {
        return <p className='text-center text-gray-500'>Cargando...</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl grid grid-cols-2 gap-6 mt-10">
            <img
                src={capitulo.imagen}
                alt={capitulo.titulo}
                className="w-full h-96 object-cover rounded-xl"
            />

            <div className="flex flex-col justify-center gap-2">
                <h2 className="text-3xl font-bold">{capitulo.titulo}</h2>
                <p className="text-gray-600">Temporada {capitulo.temporada}, Capitulo {capitulo.numero}</p>
                <p className="font-semibold text-xl">Precio: ${capitulo.precio}</p>

                <span className={`
                    px-3 py-1 text-sm font-semibold rounded-xl text-white max-w-max mt-1
                    ${capitulo.estado === "alquilado" ? "bg-red-500 " : capitulo.estado === "reservado" ? "bg-amber-600" : "bg-green-500 text-white"}`}>
                    {capitulo.estado}
                </span>

                {capitulo.estado === "disponible" && (
                    <button
                        onClick={() => confirmarPago(capitulo.id)}
                        className="mt-6 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl transition duration-180">
                        Confirmar Pago
                    </button>
                )}
            </div>
        </div>
    )
}
