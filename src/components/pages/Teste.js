import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "../pages/teste.css"


const validacao = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputTelefone, setinputTelefone] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await delay(500);
        console.log(`Username :${inputUsername}, Password :${inputTelefone}`);
        if (inputUsername !== "admin" || inputTelefone !== "admin") {
            setShow(true);
        }
        setLoading(false);
    };

    const handlePassword = () => { };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sign-in__wrapper">
          

            {/* Form */}
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
               

                {/* ALert */}
                {show ? (
                    <Alert className="mb-2" variant="danger" onClose={() => setShow(false)} dismissible >
                        Cliente não encontrado!
                    </Alert>
                ) : (
                    <div />
                )}
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" value={inputUsername}
                        placeholder="Nome" onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type="password" value={inputTelefone}
                        placeholder="Telefone" onChange={(e) => setinputTelefone(e.target.value)}
                        required
                    />
                </Form.Group>
                
                {!loading ? (
                    <Button  variant="primary" type="submit">
                       Entrar
                    </Button>
                ) : (
                    <Button  variant="primary" type="submit" disabled>
                       Entrar..
                    </Button>
                )}

            </Form>
            {/* Footer */}
            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-center">
                Felicia &copy;2024
            </div>
        </div>
    );
};

export default validacao;
