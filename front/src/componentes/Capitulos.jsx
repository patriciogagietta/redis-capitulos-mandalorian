import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export const Capitulos = ({ setReservarEstado }) => {

    const [capitulosPorTemporada, setCapitulosPorTemporada] = useState({})

    useEffect(() => {

        const obtenerCapitulos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/capitulos')
                const capitulos = response.data

                const temporadas = {}

                capitulos.forEach((capitulo) => {
                    if (!temporadas[capitulo.temporada]) {
                        temporadas[capitulo.temporada] = []
                    }

                    temporadas[capitulo.temporada].push(capitulo)
                })

                Object.keys(temporadas).forEach((temporada) => {
                    temporadas[temporada].sort((a, b) => a.numero - b.numero)
                })

                setCapitulosPorTemporada(temporadas)

            } catch (error) {
                console.log('Error al obtener los capitulos desde el front', error)
            }

        }

        obtenerCapitulos()
    }, [])
    
    return (
        <main className="max-w-7xl mx-auto p-4">
            {Object.keys(capitulosPorTemporada).map((temporada) => (
                <div key={temporada} className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Temporada {temporada}</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {capitulosPorTemporada[temporada].map((capitulo) => (
                            <div key={capitulo.id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col">
                                <img src={capitulo.imagen} alt={capitulo.titulo} className="w-full h-48 object-cover rounded-xl" />
                                <div className="flex justify-between items-center gap-6 mt-3">
                                    <h4 className="text-lg font-bold mt-2">{capitulo.titulo}</h4>

                                    <span className={`px-3 py-1 text-sm font-semibold rounded-xl text-white
                                    ${capitulo.estado === "alquilado" ? "bg-red-500 " : capitulo.estado === "reservado" ? "bg-amber-600" : "bg-green-500 text-white"}`}>
                                        {capitulo.estado}
                                    </span>
                                </div>

                                <div className="flex flex-col justify-between mt-2 h-full">
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-600">Capitulo {capitulo.numero}</p>
                                        <p className="font-semibold">Precio: ${capitulo.precio}</p>
                                    </div>
                                    
                                    <Link 
                                        to={capitulo.estado === "disponible" ? `/${capitulo.id}` : "#"}
                                        onClick={() => setReservarEstado(true)} 
                                        className={
                                                `text-center font-bold px-4 py-2 rounded-xl transition duration-180 cursor-pointer
                                                ${capitulo.estado === "disponible" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 text-gray-300 pointer-events-none"}`}
                                            >
                                            Reservar Capitulo
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </main>
    );
}
