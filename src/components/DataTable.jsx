import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DataTable = ({ dataList }) => {
    const [sortOrder, setSortOrder] = useState('asc');
    const [filteredData, setFilteredData] = useState(dataList);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [editRow, setEditRow] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '', timestamp: '' });

    useEffect(() => {
        // Load data from localStorage on component mount
        const savedData = JSON.parse(localStorage.getItem('dataList'));
        if (savedData) {
            setFilteredData(savedData);
        }
    }, []);

    useEffect(() => {
        // Save data to localStorage whenever filteredData changes
        localStorage.setItem('dataList', JSON.stringify(filteredData));
    }, [filteredData]);

    const handleSortByTimestamp = () => {
        const sortedData = [...filteredData].sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleFilter = () => {
        const filtered = dataList.filter((item) => {
            const itemDate = new Date(item.timestamp);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (!start || itemDate >= start) && (!end || itemDate <= end);
        });
        setFilteredData(filtered);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') setStartDate(value);
        if (name === 'endDate') setEndDate(value);
    };

    const handleCheckboxChange = (data) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(data)
                ? prevSelectedRows.filter((row) => row !== data)
                : [...prevSelectedRows, data]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedRows(e.target.checked ? filteredData : []);
    };

    const handleDeleteSelected = () => {
        const newData = filteredData.filter((row) => !selectedRows.includes(row));
        setFilteredData(newData);
        setSelectedRows([]);
        localStorage.setItem('dataList', JSON.stringify(newData)); // Update localStorage
    };

    const generatePDF = () => {
        if (selectedRows.length === 0) {
            alert("Please select at least one row to download.");
            return;
        }

        const doc = new jsPDF();
        doc.text("Selected Data", 20, 10);

        const headers = [["Name", "Email", "Mobile Number", "Timestamp"]];
        const data = selectedRows.map((item) => [
            item.name,
            item.email,
            item.mobileNumber,
            item.timestamp,
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 20,
            theme: "grid",
        });

        doc.save("SelectedData.pdf");
    };

    const generateCSV = () => {
        if (selectedRows.length === 0) {
            alert("Please select at least one row to download.");
            return;
        }

        const headers = ["Name", "Email", "Mobile Number", "Timestamp"];
        const csvRows = [
            headers.join(","),
            ...selectedRows.map((item) =>
                [item.name, item.email, item.mobileNumber, item.timestamp].join(",")
            )
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "SelectedData.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleEdit = (row) => {
        setEditRow(row);
        setFormData({ ...row });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = () => {
        const updatedData = filteredData.map((row) =>
            row === editRow ? formData : row
        );
        setFilteredData(updatedData);
        setEditRow(null);
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex mb-4 space-x-4">
                <div>
                    <label className="block text-gray-700">Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        className="border p-2 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange}
                        className="border p-2 rounded-md"
                    />
                </div>
                <button
                    onClick={handleFilter}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Apply Filter
                </button>
            </div>

            <div className="flex space-x-2 mb-4">
                <button
                    onClick={generatePDF}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Download Selected as PDF
                </button>
                <button
                    onClick={generateCSV}
                    className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700"
                >
                    Download Selected as CSV
                </button>
                <button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                    Delete Selected
                </button>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                            />
                        </th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Mobile Number</th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={handleSortByTimestamp}>
                            Timestamp
                            <span className="ml-2 text-sm">{sortOrder === 'asc' ? '🔼' : '🔽'}</span>
                        </th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((data, index) => (
                            <tr key={index} className="text-center">
                                <td className="py-2 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(data)}
                                        checked={selectedRows.includes(data)}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editRow === data ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            className="border p-1"
                                        />
                                    ) : (
                                        data.name
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editRow === data ? (
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="border p-1"
                                        />
                                    ) : (
                                        data.email
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editRow === data ? (
                                        <input
                                            type="text"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleFormChange}
                                            className="border p-1"
                                        />
                                    ) : (
                                        data.mobileNumber
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editRow === data ? (
                                        <input
                                            type="text"
                                            name="timestamp"
                                            value={formData.timestamp}
                                            onChange={handleFormChange}
                                            className="border p-1"
                                        />
                                    ) : (
                                        data.timestamp
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editRow === data ? (
                                        <button onClick={handleSaveEdit} className="text-blue-600">
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit(data)} className="text-blue-600">
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="py-4 text-gray-500">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;