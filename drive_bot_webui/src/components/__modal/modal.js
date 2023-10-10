// Modal.js

import { useState } from 'react';
import './modal.css'; // Import your CSS file
import { ChangeName } from './actions/changeName'

export function Modal({ confirmAction, children }) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  console.log("ssssssss", isModalOpen)
  if (!isModalOpen) {
    return null;
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ConfirmActionAndClose = () => {
    confirmAction()
    closeModal()
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          &times;
        </button>
        <div className='modal-main-content'> {children} </div>
        <div className="button-container">
          <button className="confirm-button" onClick={ConfirmActionAndClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}







// export function Modal() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleConfirm = () => {
//     // Perform the action here, e.g., submit a form or perform some other action.
//     // Close the modal after the action is complete.
//     closeModal();
//   };

//   return (
//     <div >
//       <h1>My React App</h1>
//       <button onClick={openModal}>Open Modal</button>
//       <Banner isOpen={isModalOpen} closeModal={closeModal} confirmAction={handleConfirm} />
//       {/* Rest of your application */}
//     </div>
//   );
// }









