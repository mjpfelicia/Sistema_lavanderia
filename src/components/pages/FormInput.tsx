import FormInput from "./Validacao";
import { useState } from "react";
import "../pages/FormInput.css"

import api from "../servicos/api"
import axios from "axios";

const dadosFormulario = {
    name: "",
    telefone: "",
    senha: ""
}

export default function validacao() {
    const [values, setValues] = useState(dadosFormulario);

    const [data, setData] = useState([]);

    const fetchData = () => {
        axios.post('https://api.exemplo.com/endpoint') // substitua pela URL da sua API
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error('Erro ao buscar dados:', error);
          });
      };


    const inputObjList = [

        {
            name: "name",
            type: "text",
            placeholder: "nome",
            label: "",
            errorMessage: "O Nome de usuário",
            required: true,
        },
        {
            name: "telefone",
            type: "number",
            placeholder: "Telefone",
            label: "",
            errorMessage: "Deve ser um Numero de telefone válido!",
            required: true
        },

        {
            name: "password",
            type: "password",
            placeholder: "password",
            label: "",
            errorMessage: "A senha por favor!",
        },


    ];

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        console.log(e.target.name, e.target.value)
    };


    return (
        <div>
            <div className="validacao">
                <form action="" onSubmit={handleSubmit}>
                    {inputObjList.map((input, idx) => (
                        <div className="field-control" key={idx}>
                            <FormInput {...input} value={values[input.name]} onChange={onChange}
                            />
                        </div>
                    ))}


                    <button type="submit">Enter</button>

                </form>
            </div>
        </div>
    );
}
