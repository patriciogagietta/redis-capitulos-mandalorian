import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Header } from './componentes/Header.jsx'
import { Capitulos } from './componentes/Capitulos.jsx'
import { CapituloPago } from './componentes/CapituloPago.jsx'

function App() {

  const [reservarEstado, setReservarEstado] = useState(false)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Capitulos setReservarEstado={setReservarEstado} />} />
        <Route path="/:idCapitulo" element={<CapituloPago reservarEstado={reservarEstado} />} />
      </Routes>
    </>
  )
}

export default App
