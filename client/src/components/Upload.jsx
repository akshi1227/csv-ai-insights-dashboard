import React, { useState } from 'react';
import { endpoints } from '../api';

const Upload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError(null);
        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
            setError("Please verify you are uploading a CSV file.");
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

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
                const errData = await response.json();
                throw new Error(errData.error || 'Upload failed');
            }

            const data = await response.json();
            onUploadSuccess(data);
        } catch (err) {
            console.error("Upload error details:", err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload Data</h2>
            <div
                className={`upload-box ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="upload-content">
                    {file ? (
                        <div className="file-selected">
                            <span className="file-icon">📄</span>
                            <p className="filename">{file.name}</p>
                            <p className="filesize">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <>
                            <p className="upload-hint">Drag & drop your CSV here</p>
                            <span className="or-divider">or</span>
                        </>
                    )}

                    <label htmlFor="file-upload" className="secondary-btn">
                        {file ? 'Change File' : 'Browse Files'}
                    </label>
                </div>

                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="primary-btn pulse-anim"
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        {uploading ? 'Analyzing...' : 'Start Analysis'}
                    </button>
                )}
            </div>
            {error && <div className="error-msg glass-error">{error}</div>}

            <style>{`
                .upload-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    text-align: center;
                }
                .upload-hint {
                    font-size: 1.2rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }
                .or-divider {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin: 0.5rem 0;
                }
                .file-icon {
                    font-size: 2.5rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .filename {
                    font-weight: 600;
                    color: var(--accent-primary);
                }
                .secondary-btn {
                    margin-top: 0.5rem;
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .secondary-btn:hover {
                    border-color: #fff;
                    background: rgba(255,255,255,0.05);
                }
                .glass-error {
                    margin-top: 1rem;
                    padding: 0.8rem;
                    background: rgba(248, 113, 113, 0.2);
                    border: 1px solid rgba(248, 113, 113, 0.4);
                    border-radius: 8px;
                    color: #ffcccc;
                }
                .drag-active {
                    border-color: var(--accent-secondary) !important;
                    background: rgba(168, 85, 247, 0.1) !important;
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default Upload;
