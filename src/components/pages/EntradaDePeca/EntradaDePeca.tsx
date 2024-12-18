      
      
import Header from '../../Header/Header';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';



const Home = () => {
  return (
    <div>
      <Header nomePagina='' />
      < ServicoLavagem cliente={{
        id: 0,
        nome: '',
        email: '',
        telefone: '',
        endereco: {
          endereco: '',
          numero: '',
          estado: '',
          cep: '',
          bairro: '',
          complemento: ''
        },
      }} />
    </div>
  )
}

export default Home