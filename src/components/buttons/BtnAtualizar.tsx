import React from 'react';


type BtnAtualizaProps = {
  onClick: () => void;
};

const BtnAtualiza: React.FC<BtnAtualizaProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>    
    </button>
  );
};

export default BtnAtualiza;


