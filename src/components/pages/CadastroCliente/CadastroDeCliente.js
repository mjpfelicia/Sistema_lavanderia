import React from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CadastroDeCliente.css"


const AddressForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <div>
      <div className='cadastroDeCiente'>
        
        <Form onSubmit={handleSubmit} >
          <Form.Group controlId="formNome">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control type="text" name="nome" placeholder="Nome" required />
          </Form.Group>

          <Form.Group controlId="formCep">
            <Form.Label>CEP</Form.Label>
            <Form.Control type="text" name="cep" placeholder="CEP" required />
          </Form.Group>


          <Form.Group controlId="formRua">
            <Form.Label>Rua</Form.Label>
            <Form.Control type="text" name="rua" placeholder="Rua" required />
          </Form.Group>

          <Form.Group controlId="formNumero">
            <Form.Label>Número</Form.Label>
            <Form.Control type="text" name="numero" placeholder="Número" required />
          </Form.Group>

          <Form.Group controlId="formBairro">
            <Form.Label>Bairro</Form.Label>
            <Form.Control type="text" name="bairro" placeholder="Bairro" required />
          </Form.Group>

          <Form.Group controlId="formCidade">
            <Form.Label>Cidade</Form.Label>
            <Form.Control type="text" name="cidade" placeholder="Cidade" required />
          </Form.Group>


          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control type="text" name="estado" placeholder="Estado" required />
          </Form.Group>


          <Button variant="primary" type="submit" className="mt-3">
            Enviar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddressForm;
