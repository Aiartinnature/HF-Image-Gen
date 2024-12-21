import React from 'react';
import './ModelSelector.css';

const ModelSelector = ({ models = [], selectedModel, onModelChange, disabled }) => {
    return (
        <div className="model-selector">
            <label htmlFor="model-select">Select Model:</label>
            <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="model-select"
                disabled={disabled}
            >
                {models.map((model) => (
                    <option key={model.key} value={model.key}>
                        {model.name}
                    </option>
                ))}
            </select>
            {models.find(m => m.key === selectedModel)?.description && (
                <p className="model-description">
                    {models.find(m => m.key === selectedModel).description}
                </p>
            )}
        </div>
    );
};

export default ModelSelector;
