import React from 'react';

const MapaComponent = () => {
  return (
    <div style={{ width: '100%', height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center',paddingTop:'5rem' }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14620.19588449686!2d-46.75752299999999!3d-23.638417200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1728501944677!5m2!1spt-BR!2sbr"
        width="90%"
        height="100%"
        style={{ border: '0' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      ></iframe>
    </div>
  );
};

export default MapaComponent;
