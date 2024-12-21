const API_BASE_URL = 'http://localhost:5000/api';

let currentRequestId = null;
let currentController = null;

export const cancelGeneration = async () => {
    if (currentRequestId) {
        try {
            // First, cancel the client-side fetch
            if (currentController) {
                currentController.abort();
                currentController = null;
            }

            // Then, tell the server to cancel the request
            await fetch(`${API_BASE_URL}/image/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: currentRequestId })
            });
        } catch (error) {
            console.error('Error cancelling request:', error);
            // Don't throw error for cancellation issues
        } finally {
            currentRequestId = null;
        }
    }
};

const handleRateLimit = (error) => {
    // Extract wait time from error message (default to 60 seconds if not found)
    const waitTimeMatch = error.message.match(/Wait up to (\d+) minute/);
    const waitTimeSeconds = waitTimeMatch ? parseInt(waitTimeMatch[1]) * 60 : 60;
    
    const rateLimitError = new Error('Rate limit reached');
    rateLimitError.isRateLimit = true;
    rateLimitError.waitTimeSeconds = waitTimeSeconds;
    throw rateLimitError;
};

export const generateImage = async (prompt, width, height, model = 'flux-schnell') => {
    try {
        // Cancel any ongoing requests
        await cancelGeneration();

        // Create a new AbortController for this request
        currentController = new AbortController();
        console.log('Sending request with:', { prompt, width, height, model });

        const response = await fetch(`${API_BASE_URL}/image/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, width, height, model }),
            signal: currentController.signal
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Server error:', data);
            if (response.status === 429) {
                return handleRateLimit(new Error(data.error));
            }
            throw new Error(data.error || 'Failed to generate image');
        }

        if (!data.image) {
            throw new Error('No image data received from server');
        }

        // Store the request ID for potential cancellation
        currentRequestId = data.requestId;

        return data.image;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Image generation cancelled');
        }
        if (error.isRateLimit) {
            throw error; // Re-throw rate limit errors
        }
        console.error('Error generating image:', error);
        throw error;
    } finally {
        if (!currentRequestId) {
            currentController = null;
        }
    }
};

export const downloadImage = async (imageUrl, prompt) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${prompt.slice(0, 30)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading image:', error);
        throw new Error('Failed to download image');
    }
};
