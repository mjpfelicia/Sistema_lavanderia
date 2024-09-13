import React, { useState } from "react";
import { InputForm } from "../FormularioDEInput/FormInput";


const FormInput = (input: InputForm) => {
    const [focused, setFocused] = useState(false);
    const { errorMessage, label, id, ...inputProps } = input;


    const handleFocus = (e: { preventDefault: () => void; }) => {
        setFocused(true);
        e.preventDefault();
    };
    return (
        <>
            <div>
                <label>{label}</label>
                <input {...inputProps} onBlur={handleFocus}
                    onFocus={() => inputProps.name === "confirmPassword" && setFocused(true)
                    }
                />

                <span className="span_error">{errorMessage}</span>
            </div>
        </>
    );
};

export default FormInput;
