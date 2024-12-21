import React from 'react';

const DimensionControls = ({ width, height, onWidthChange, onHeightChange, disabled }) => (
    <div className="dimensions-container">
        <div className="dimension-input">
            <label htmlFor="width">Width:</label>
            <select
                id="width"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="dimension-select"
                disabled={disabled}
            >
                <option value="512">512px</option>
                <option value="768">768px</option>
                <option value="1024">1024px</option>
                <option value="1280">1280px</option>
            </select>
        </div>
        
        <div className="dimension-input">
            <label htmlFor="height">Height:</label>
            <select
                id="height"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="dimension-select"
                disabled={disabled}
            >
                <option value="512">512px</option>
                <option value="768">768px</option>
                <option value="1024">1024px</option>
                <option value="1280">1280px</option>
            </select>
        </div>
    </div>
);

export default DimensionControls;
