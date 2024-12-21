import React, { useState, useEffect } from 'react';
import { generateImage, cancelGeneration } from '../../services/imageService';
import PromptInput from './PromptInput';
import DimensionControls from './DimensionControls';
import ImageDisplay from './ImageDisplay';
import ModelSelector from './ModelSelector';
import './ImageGenerator.css';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('flux-schnell');
    const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

    useEffect(() => {
        fetchModels();
        // Cleanup function to cancel any pending requests without showing error
        return () => {
            cancelGeneration().catch(console.error);
        };
    }, []);

    useEffect(() => {
        let timer;
        if (rateLimitCountdown > 0) {
            timer = setInterval(() => {
                setRateLimitCountdown(prev => {
                    if (prev <= 1) {
                        setError(''); // Clear the error when countdown finishes
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [rateLimitCountdown]);

    const fetchModels = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/image/models');
            const data = await response.json();
            setModels(data.models);
        } catch (error) {
            console.error('Error fetching models:', error);
            setError('Failed to load models');
        }
    };

    const handleCancel = async () => {
        console.log('Cancelling generation...');
        await cancelGeneration();
        setLoading(false);
        setError('Image generation cancelled');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        if (rateLimitCountdown > 0) {
            setError(`Please wait ${rateLimitCountdown} seconds before generating another image`);
            return;
        }
        
        setLoading(true);
        setError('');
        setImageUrl('');

        try {
            const image = await generateImage(prompt, width, height, selectedModel);
            setImageUrl(image);
            setError(''); // Clear any previous errors on success
        } catch (error) {
            if (error.message === 'Image generation cancelled') {
                setError('Image generation cancelled');
            } else if (error.isRateLimit) {
                setRateLimitCountdown(error.waitTimeSeconds);
                setError(`Rate limit reached. Please wait ${error.waitTimeSeconds} seconds.`);
            } else if (error.message.includes('busy') || error.message.includes('timeout')) {
                // Keep the error message but don't disable the form
                setError(error.message);
            } else {
                setError(error.message || 'Failed to generate image');
            }
        } finally {
            setLoading(false);
        }
    };

    const getButtonText = () => {
        if (loading) return 'Cancel';
        if (rateLimitCountdown > 0) return `Wait ${rateLimitCountdown}s`;
        return 'Generate';
    };

    return (
        <div className="image-generator">
            <h1 className="app-title">AI Image Generator</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="generator-form">
                    <ModelSelector
                        models={models}
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        disabled={loading || rateLimitCountdown > 0}
                    />
                    
                    <PromptInput
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        disabled={loading || rateLimitCountdown > 0}
                    />

                    <DimensionControls
                        width={width}
                        height={height}
                        onWidthChange={setWidth}
                        onHeightChange={setHeight}
                        disabled={loading || rateLimitCountdown > 0}
                    />

                    <div className="button-container">
                        <button 
                            type="button"
                            onClick={loading ? handleCancel : handleSubmit}
                            className={loading ? "cancel-button" : rateLimitCountdown > 0 ? "rate-limit-button" : ""}
                            disabled={(!prompt.trim() && !loading) || (rateLimitCountdown > 0 && !loading)}
                        >
                            {getButtonText()}
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    
                    {imageUrl && (
                        <ImageDisplay
                            imageUrl={imageUrl}
                            loading={loading}
                            prompt={prompt}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default ImageGenerator;
