import './App.css';
import * as React from "react";
import Rotas from "./components/pages/Rotas";
import background from "./img/bgcontainer.webp";

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
