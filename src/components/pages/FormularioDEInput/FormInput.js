import FormInput from "../ValidacaoDeCliente/Validacao";
import { useState } from "react";
import "../FormularioDEInput/FormInput.css"

export default function validacao() {
    const [values, setValues] = useState({
        name: "",
        telefone: "",
        password: ""
    });

    const inputObjList = [

        {
            name: "name",
            type: "text",
            placeholder: "nome",
            label: "",
            errorMessage: "O Nome de usuário",
            class: "controle_de_campo",
            required: true,
        },
        {


            name: "telefone",
            type: "text",
            label: "",
            placeholder: "Telefone",
            errorMessage: "Deve ser um Numero de telefone válido!",
            class: "controle_de_campo",

            required: true
        },

        {
            name: "password",
            type: "password",
            placeholder: "password",
            label: "",
            errorMessage: "A senha por favor!",
            class: "passwordInput"
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
                <form action="" id="formulario" onSubmit={handleSubmit}>
                    {inputObjList.map((input, idx) => (
                        <div className={input.class} key={idx}>
                            <FormInput {...input} value={values[input.name]} onChange={onChange}
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn_enter">Enter</button>
                </form>

            </div>
        </div>
    );
}
