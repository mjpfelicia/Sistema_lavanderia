import FormInput from "./Validacao";
import { useState } from "react";
import "../pages/FormInput.css"

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
            required: true,
        },
        {
            name: "telefone",
            type: "text",
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
    );
}
