import React from 'react';
import { downloadImage } from '../../services/imageService';

const ImageDisplay = ({ imageUrl, loading, prompt }) => {
    const handleDownload = async () => {
        try {
            await downloadImage(imageUrl, prompt);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Generating image...</p>
            </div>
        );
    }

    return (
        <div className="generated-image-container">
            <img 
                src={imageUrl} 
                alt="Generated" 
                className="generated-image"
            />
            <button 
                className="download-button"
                onClick={handleDownload}
            >
                Download Image
            </button>
        </div>
    );
};

export default ImageDisplay;
