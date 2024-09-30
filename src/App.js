import './App.css';
import Rotas from "./components/pages/Rotas";
import background from '../src/img/bgcontainer.jpg';

const styles = {
  header: {
    backgroundImage: `url(${background})`,
    height: '100vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },

}


function App() {
  return (
    <div>
      <div className="App" style={styles.header}>
        <Rotas />
        
      </div>

    </div>
  );
}

export default App;
