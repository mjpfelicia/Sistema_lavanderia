import React from 'react';
import Brin from '../../img/iconsbin-.png';
import  classes from'../buttons/BtnAtualiza.module.css'



type ButtonProps = {
  onClick: () => void;

};

const BtnDeletar: React.FC<ButtonProps> = ({ onClick}) => {
  return (
    <button onClick={onClick} className={classes.btn}>
       <img src={Brin} alt="pincel" style={{ width: '1rem', height: '1rem' }} ></img>
    </button>
    
  );
};

export default BtnDeletar;