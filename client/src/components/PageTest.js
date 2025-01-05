import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa'; // Import icons for PDF, Word, and generic file
import axios from 'axios';

const Page = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Handle file upload (whether via input or drag-and-drop)
    const handleFileUpload = async (files) => {
        setUploading(true); // Set uploading state
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));

            // Send files to the backend
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
                alert('Files uploaded successfully!');
            } else {
                alert('Failed to upload files.');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('An error occurred while uploading files.');
        } finally {
            setUploading(false); // Reset uploading state
        }
    };

    // Handle file removal
    const handleFileRemove = (fileToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((file) => file !== fileToRemove)
        );
    };

    // Get the file icon based on the file type
    const getFileIcon = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        switch (fileExtension) {
            case 'pdf':
                return <FaFilePdf className="text-red-500 mr-2" />;
            case 'doc':
            case 'docx':
                return <FaFileWord className="text-blue-500 mr-2" />;
            default:
                return <FaFile className="text-gray-500 mr-2" />;
        }
    };

    // Drag and Drop setup using useDropzone hook
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles),
        multiple: true, // Allow multiple files to be dropped
        accept: 'image/*,application/pdf,.doc,.docx', // Specify acceptable file types
    });

    return (
        <div>
            <div className="bg-neutral-900">
                <div className="max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
                    <div className="max-w-3xl mb-10 lg:mb-14">
                        <h2 className="text-white font-semibold text-2xl md:text-4xl md:leading-tight">How it Works</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
                        <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
                            <img
                                className="w-full object-cover rounded-xl"
                                src="https://img.freepik.com/free-photo/taking-photo-cooked-salmon-ai-generated-image_268835-6839.jpg"
                                alt="Features Image"
                            />
                        </div>
                        <div className="upload-section">
                            {/* Upload Button */}
                            <div>
                                <label className="group inline-flex items-center gap-x-2 py-6 px-10 bg-[#3D5300] font-medium text-base text-[#FFE31A] rounded-full focus:outline-none cursor-pointer">
                                    UPLOAD DOCUMENTS
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Drag and Drop Section */}
                            <div
                                {...getRootProps()}
                                className="mt-4 p-4 border-2 border-dashed border-neutral-600 rounded-lg bg-neutral-800 text-center text-white"
                            >
                                <input {...getInputProps()} />
                                <p>
                                    {uploading
                                        ? 'Uploading files...'
                                        : 'Drag and drop files here, or click to select files'}
                                </p>
                            </div>

                            {/* Display Uploaded Documents */}
                            <div className="uploaded-files mt-4">
                                {uploadedFiles.length > 0 && (
                                    <ul className="list-disc pl-5">
                                        {uploadedFiles.map((file, index) => (
                                            <li
                                                key={index}
                                                className="text-white text-lg flex justify-between items-center mt-3"
                                            >
                                                {/* Display File Icon */}
                                                {getFileIcon(file)}
                                                <span>{file.name}</span>

                                                {/* Remove Button (Cross Mark) */}
                                                <button
                                                    onClick={() => handleFileRemove(file)}
                                                    className="ml-4 text-xl text-red-500 hover:text-red-700"
                                                    aria-label="Remove file"
                                                >
                                                    &#10005; {/* Cross mark */}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
