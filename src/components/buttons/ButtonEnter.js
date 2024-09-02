
import React, { useState } from 'react';
import "../buttons/ButtonEnter.css"

const ButtonEnter = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);



    return (
        <div className='btn_Password'>
            <input type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha"
            />

        </div>
    );
};

export default ButtonEnter;
