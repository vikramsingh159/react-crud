// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import FormComponent from './FormComponent';
// import DataTable from './DataTable';
// import 'jspdf-autotable';

// const MainComponent = () => {
//     const [showModal, setShowModal] = useState(false);   // Controls form modal visibility
//     const [dataList, setDataList] = useState([]);        // Holds all submitted form data
//     const [formSubmitted, setFormSubmitted] = useState(false); // Tracks if a form has been submitted

//     // Load data from local storage on component mount
//     useEffect(() => {
//         const storedData = JSON.parse(localStorage.getItem('formDataList')) || [];
//         setDataList(storedData);
//     }, []);

//     // Save form data with timestamp and update local storage
//     const handleSave = (formData) => {
//         const timestamp = new Date().toLocaleString(); // Get current date and time
//         const updatedDataList = [...dataList, { ...formData, timestamp }];
//         setDataList(updatedDataList);
//         localStorage.setItem('formDataList', JSON.stringify(updatedDataList));
//         setFormSubmitted(true);  // Set form submitted to true after successful save
//     };

//     // Open and close modal handlers
//     const handleOpen = () => setShowModal(true);
//     const handleClose = () => setShowModal(false);

//     return (
//         <div className="p-8">
//             <button
//                 onClick={handleOpen}
//                 className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-4"
//             >
//                 Open Form
//             </button>

//             {/* Display download link only after form submission */}
//             {formSubmitted && (
//                 <div className="flex justify-center mb-4">
//                     <Link className="bg-red-600 text-white rounded-full py-3 px-6" to="/frontend.pdf" target="_blank">
//                         Free Download PDF
//                     </Link>
//                 </div>
//             )}

//             {/* Modal for FormComponent */}
//             {showModal && (
//                 <FormComponent
//                     onSave={handleSave}     // Pass handleSave to handle form data saving
//                     show={showModal}        // Pass modal visibility state
//                     onClose={handleClose}   // Close modal handler
//                 />
//             )}

//             <h2 className="text-2xl font-semibold mb-4">Submitted Data</h2>

//             {/* Render DataTable and pass dataList as prop */}
//             <DataTable dataList={dataList} />
//         </div>
//     );
// };

// export default MainComponent;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FormComponent from './FormComponent';
import DataTable from './DataTable';
import 'jspdf-autotable';

const MainComponent = () => {
    const [showModal, setShowModal] = useState(false);   // Controls form modal visibility
    const [dataList, setDataList] = useState([]);        // Holds all submitted form data
    const [formSubmitted, setFormSubmitted] = useState(false); // Tracks if a form has been submitted

    // Load data from local storage on component mount
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('formDataList')) || [];
        setDataList(storedData);
    }, []);

    // Save form data with timestamp and update local storage
    const handleSave = (formData) => {
        const timestamp = new Date().toLocaleString(); // Get current date and time
        const updatedDataList = [...dataList, { ...formData, timestamp }];
        setDataList(updatedDataList);
        localStorage.setItem('formDataList', JSON.stringify(updatedDataList));
        setFormSubmitted(true);  // Set form submitted to true after successful save
    };

    // Open and close modal handlers
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Refresh the page after download starts
    const handleDownload = () => {
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Delay to ensure download starts before refresh
    };

    return (
        <div className="p-8">
            <button
                onClick={handleOpen}
                className="bg-red-600 text-white rounded-full py-3 px-6"
            >
                Open Form
            </button>

            {/* Display download link only after form submission */}
            {formSubmitted && (
                <div className="flex justify-center mb-4">
                    <Link
                        className="bg-red-600 text-white rounded-full py-3 px-6"
                        to="/frontend.pdf"
                        target="_blank"
                        onClick={handleDownload}
                    >
                        Free Download PDF
                    </Link>
                </div>
            )}

            {/* Modal for FormComponent */}
            {showModal && (
                <FormComponent
                    onSave={handleSave}     // Pass handleSave to handle form data saving
                    show={showModal}        // Pass modal visibility state
                    onClose={handleClose}   // Close modal handler
                />
            )}

            {/* Render DataTable and pass dataList as prop */}
            <DataTable dataList={dataList} />
        </div>
    );
};

export default MainComponent;
