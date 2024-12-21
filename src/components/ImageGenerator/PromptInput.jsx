import React from 'react';
import './ImageGenerator.css';

const PromptInput = ({ prompt, onPromptChange, disabled }) => (
    <div className="prompt-input-container">
        <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={4}
            disabled={disabled}
        />
    </div>
);

export default PromptInput;
