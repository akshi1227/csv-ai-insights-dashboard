import React, { useState } from 'react';
import { endpoints } from '../api';

const Upload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a CSV file.');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);

        setUploading(true);
        setError(null);

        try {
            const response = await fetch(endpoints.upload, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadSuccess(data); // Pass { filename, summary } up to parent
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload CSV Data</h2>
            <div className="upload-box">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="primary-btn"
                >
                    {uploading ? 'Processing...' : 'Upload & Preview'}
                </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default Upload;
