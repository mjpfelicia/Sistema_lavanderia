import Header from "../../Header/Header"
import BackToHome from "../../buttons/BackToHome"
import MapaComponent from '../Mapa/MapaComponent'



const Mapa = () => {
  return (
    <div>
      <Header nomePagina={"Mapa"} />
      <div style={{ padding: '0.5rem 1rem' }}>
        <BackToHome variant="icon" />
      </div>
      <MapaComponent />
    </div>
  )
}

export default Mapa