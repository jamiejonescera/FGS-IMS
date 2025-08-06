// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';

// const ManageMaintenanceModal = ({ isOpen, onClose, maintenance, setMaintenanceRecords }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [notes, setNotes] = useState('');
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [confirmationAction, setConfirmationAction] = useState(null);

//   // Reset notes and confirmation state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setNotes('');
//       setShowConfirmation(false);
//       setConfirmationAction(null);
//     }
//   }, [isOpen]);

//   // Determine initial step based on status
//   useEffect(() => {
//     if (maintenance?.status === 'in_progress') {
//       setCurrentStep(2);
//     } else {
//       setCurrentStep(1);
//     }
//   }, [maintenance]);

//   if (!isOpen) return null;

//   const handleTakeAction = async () => {
//     try {
//       const response = await fetch(`/api/maintenance/take_action/${maintenance.maintenance_id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!response.ok) throw new Error('Failed to update status');

//       const updatedMaintenance = await response.json();

//       setMaintenanceRecords((prevRecords) =>
//         prevRecords.map((record) =>
//           record.maintenance_id === updatedMaintenance.maintenance_id
//             ? updatedMaintenance
//             : record
//         )
//       );

//       toast.success('Maintenance status updated to In-Progress');
//       setCurrentStep(2);
//     } catch (error) {
//       toast.error('Error taking action');
//       console.error(error);
//     }
//   };

//   const handleCompleteAction = async () => {
//     try {
//       const response = await fetch(`/api/maintenance/take_action_completed/${maintenance.maintenance_id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ notes }),
//       });

//       if (!response.ok) throw new Error('Failed to mark as completed');

//       const updatedMaintenance = await response.json();

//       setMaintenanceRecords((prevRecords) =>
//         prevRecords.map((record) =>
//           record.maintenance_id === updatedMaintenance.maintenance_id
//             ? updatedMaintenance
//             : record
//         )
//       );

//       toast.success('Maintenance marked as Completed');
//       onClose();
//     } catch (error) {
//       toast.error('Error completing maintenance');
//       console.error(error);
//     }
//   };

//   const handleCondemnAction = async () => {
//     try {
//       const response = await fetch(`/api/maintenance/take_action_condemned/${maintenance.maintenance_id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ notes }),
//       });

//       if (!response.ok) throw new Error('Failed to mark as condemned');

//       const updatedMaintenance = await response.json();

//       setMaintenanceRecords((prevRecords) =>
//         prevRecords.map((record) =>
//           record.maintenance_id === updatedMaintenance.maintenance_id
//             ? updatedMaintenance
//             : record
//         )
//       );

//       toast.success('Maintenance marked as Condemned');
//       onClose();
//     } catch (error) {
//       toast.error('Error condemning maintenance');
//       console.error(error);
//     }
//   };

//   const confirmAction = (action) => {
//     if (!notes.trim()) {
//       toast.error('Please provide notes before proceeding.');
//       return;
//     }
//     setConfirmationAction(action);
//     setShowConfirmation(true);
//   };

//   const executeConfirmationAction = () => {
//     if (confirmationAction === 'complete') {
//       handleCompleteAction();
//     } else if (confirmationAction === 'condemn') {
//       handleCondemnAction();
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-lg">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Maintenance</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
//             &times;
//           </button>
//         </div>

//         {/* Stepper Navigation */}
//         <div className="flex justify-between mb-6">
//           <div
//             className={`flex-1 text-center border-b-2 pb-2 ${
//               currentStep === 1 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
//             }`}
//           >
//             Maintenance Details
//           </div>
//           <div
//             className={`flex-1 text-center border-b-2 pb-2 ${
//               currentStep === 2 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
//             }`}
//           >
//             In-Progress
//           </div>
//         </div>

//         {/* Stepper Content */}
//         <div className="space-y-4">
//           {currentStep === 1 && (
//             <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600 font-medium">Product Name:</span>
//                   <span className="text-gray-800">{maintenance?.product_name || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600 font-medium">Description:</span>
//                   <span className="text-gray-800">{maintenance?.description || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600 font-medium">Engineer:</span>
//                   <span className="text-gray-800">{maintenance?.engineer_name || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//           {currentStep === 2 && (
//             <div>
//               <div className="mt-4 space-y-4">
//                 <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
//                   <span className="text-gray-600 font-medium">Product Name:</span>
//                   <span className="text-gray-800">{maintenance?.product_name || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
//                   <span className="text-gray-600 font-medium">Description:</span>
//                   <span className="text-gray-800">{maintenance?.description || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
//                   <span className="text-gray-600 font-medium">Engineer Name:</span>
//                   <span className="text-gray-800">{maintenance?.engineer_name || 'N/A'}</span>
//                 </div>
//                 <div className="mt-3">
//                   <label className="block text-gray-700 font-medium mb-2">Action Taken</label>
//                   <textarea
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     className="w-full p-2 border rounded-md shadow-sm"
//                     rows="4"
//                     placeholder="Enter action taken here..."
//                   ></textarea>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Confirmation Dialog */}
//         {showConfirmation && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg">

//               <p className="mb-4">
//                 Are you sure you want to mark this maintenance as{' '}
//                 {confirmationAction === 'complete' ? 'Repaired' : 'Disposed'}?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowConfirmation(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={executeConfirmationAction}
//                   className={`px-4 py-2 rounded-lg ${
//                     confirmationAction === 'complete'
//                       ? 'bg-green-500 text-white hover:bg-green-600'
//                       : 'bg-red-500 text-white hover:bg-red-600'
//                   }`}
//                 >
//                   Yes, Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal Footer */}
//         <div className="mt-4">
//           {currentStep === 1 && (
//             <div className="flex justify-end">
//               <button
//                 onClick={handleTakeAction}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Take Action
//               </button>
//             </div>
//           )}
//           {currentStep === 2 && (
//             <div className="flex justify-between">
//               <button
//                 onClick={() => confirmAction('condemn')}
//                 disabled={!notes.trim()}
//                 className={`px-4 py-2 rounded-lg ${
//                   notes.trim()
//                     ? 'bg-red-500 text-white hover:bg-red-600'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Disposed Assets
//               </button>
//               <button
//                 onClick={() => confirmAction('complete')}
//                 disabled={!notes.trim()}
//                 className={`px-4 py-2 rounded-lg ${
//                   notes.trim()
//                     ? 'bg-green-500 text-white hover:bg-green-600'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Repaired
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageMaintenanceModal;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ManageMaintenanceModal = ({ isOpen, onClose, maintenance, setMaintenanceRecords }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Reset notes and confirmation state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNotes('');
      setShowConfirmation(false);
      setConfirmationAction(null);
      setIsConfirmed(false); // Reset confirmation checkbox
    }
  }, [isOpen]);

  // Determine initial step based on status
  useEffect(() => {
    if (maintenance?.status === 'in_progress') {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [maintenance]);

  if (!isOpen) return null;

  const handleTakeAction = async () => {
    try {
      const response = await fetch(`/api/maintenance/take_action/${maintenance.maintenance_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedMaintenance = await response.json();

      setMaintenanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.maintenance_id === updatedMaintenance.maintenance_id
            ? updatedMaintenance
            : record
        )
      );

      toast.success('Maintenance status updated to In-Progress');
      setCurrentStep(2);
    } catch (error) {
      toast.error('Error taking action');
      console.error(error);
    }
  };

  const handleCompleteAction = async () => {
    try {
      const response = await fetch(`/api/maintenance/take_action_completed/${maintenance.maintenance_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to mark as completed');

      const updatedMaintenance = await response.json();

      setMaintenanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.maintenance_id === updatedMaintenance.maintenance_id
            ? updatedMaintenance
            : record
        )
      );

      toast.success('Maintenance marked as Completed');
      onClose();
    } catch (error) {
      toast.error('Error completing maintenance');
      console.error(error);
    }
  };

  const handleCondemnAction = async () => {
    try {
      const response = await fetch(`/api/maintenance/take_action_condemned/${maintenance.maintenance_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to mark as condemned');

      const updatedMaintenance = await response.json();

      setMaintenanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.maintenance_id === updatedMaintenance.maintenance_id
            ? updatedMaintenance
            : record
        )
      );

      toast.success('Maintenance marked as Condemned');
      onClose();
    } catch (error) {
      toast.error('Error condemning maintenance');
      console.error(error);
    }
  };

  const confirmAction = (action) => {
    if (!notes.trim()) {
      toast.error('Please provide notes before proceeding.');
      return;
    }
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const executeConfirmationAction = () => {
    if (confirmationAction === 'complete') {
      handleCompleteAction();
    } else if (confirmationAction === 'condemn') {
      handleCondemnAction();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Maintenance</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="flex justify-between mb-6">
          <div
            className={`flex-1 text-center border-b-2 pb-2 ${
              currentStep === 1 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
            }`}
          >
            Maintenance Details
          </div>
          <div
            className={`flex-1 text-center border-b-2 pb-2 ${
              currentStep === 2 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
            }`}
          >
            In-Progress
          </div>
        </div>

        {/* Stepper Content */}
        <div className="space-y-4">
          {currentStep === 1 && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Product Name:</span>
                  <span className="text-gray-800">{maintenance?.product_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Description:</span>
                  <span className="text-gray-800">{maintenance?.description || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Engineer:</span>
                  <span className="text-gray-800">{maintenance?.engineer_name || 'N/A'}</span>
                </div>
                {/* Confirmation Checkbox */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="confirm"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I confirm that the information I filled is correct.
                  </label>
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium">Product Name:</span>
                  <span className="text-gray-800">{maintenance?.product_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium">Description:</span>
                  <span className="text-gray-800">{maintenance?.description || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm">
                  <span className="text-gray-600 font-medium">Engineer Name:</span>
                  <span className="text-gray-800">{maintenance?.engineer_name || 'N/A'}</span>
                </div>
                <div className="mt-3">
                  <label className="block text-gray-700 font-medium mb-2">Action Taken</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-md shadow-sm"
                    rows="4"
                    placeholder="Enter action taken here..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg">
              <p className="mb-4">
                Are you sure you want to mark this maintenance as{' '}
                {confirmationAction === 'complete' ? 'Repaired' : 'Disposed'}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmationAction}
                  className={`px-4 py-2 rounded-lg ${
                    confirmationAction === 'complete'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-4">
          {currentStep === 1 && (
            <div className="flex justify-end">
              <button
                onClick={handleTakeAction}
                disabled={!isConfirmed}
                className={`px-4 py-2 rounded-lg ${
                  isConfirmed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Take Action
              </button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex justify-between">
              <button
                onClick={() => confirmAction('condemn')}
                disabled={!notes.trim()}
                className={`px-4 py-2 rounded-lg ${
                  notes.trim()
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Disposed Assets
              </button>
              <button
                onClick={() => confirmAction('complete')}
                disabled={!notes.trim()}
                className={`px-4 py-2 rounded-lg ${
                  notes.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Repaired
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMaintenanceModal;