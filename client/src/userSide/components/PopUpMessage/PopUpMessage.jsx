import React, { useState } from 'react';
import Modal from 'react-modal';

const PopUpMessage = ({ message }) => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    content: {
      top: '20%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '20rem',
      marginRight: '-50%',
      transform: 'translate(-80%, -80%)',
      
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Popup Message"
      style={customStyles}
    >
      <p className='text-center font-semibold text-header-bot'>{message}</p>
    </Modal>
  );
};

export default PopUpMessage;
