// import React from 'react';

// const EvaluationModal = ({
//   isOpen,
//   undamagedQuantity,
//   damagedQuantity,
//   setUndamagedQuantity,
//   setDamagedQuantity,
//   onClose,
//   onSubmit,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h3 className="text-xl font-bold mb-4">Evaluate Purchase Request</h3>

//         {/* Undamaged Quantity Input */}
//         <div className="mb-4">
//           <label className="block mb-2">Undamaged Quantity</label>
//           <input
//             type="number"
//             min="0"
//             value={undamagedQuantity}
//             onChange={(e) => setUndamagedQuantity(e.target.value)}
//             className="input"
//             placeholder="Enter undamaged quantity"
//           />
//         </div>

//         {/* Damaged Quantity Input */}
//         <div className="mb-4">
//           <label className="block mb-2">Damaged Quantity</label>
//           <input
//             type="number"
//             min="0"
//             value={damagedQuantity}
//             onChange={(e) => setDamagedQuantity(e.target.value)}
//             className="input"
//             placeholder="Enter damaged quantity"
//           />
//         </div>

//         <div className="modal-actions flex justify-between">
//           <button onClick={onSubmit} className="btn btn-primary">
//             Submit Evaluation
//           </button>
//           <button onClick={onClose} className="btn btn-secondary">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EvaluationModal;
