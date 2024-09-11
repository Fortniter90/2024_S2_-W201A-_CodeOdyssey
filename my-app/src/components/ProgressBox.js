import React, { useState } from "react";
import "./ProgressBox.css";

const ProgressBox = () => {
    const [progress1, setProgress1] = useState(5); // Example progress value for box 1
    const [progress2, setProgress2] = useState(7); // Example progress value for box 2

    return (
        <div className="progress-box">
            <div className="progress-tab">
                <span className="tab-text">PROGRESS</span>
            </div>
            <div className="progress-content">
                <div className="progress-item">
                    <div className="progress-item-box">
                        <span className="progress-text">LANGUAGE1</span>
                        <div className="progress-completed">
                        <span className="progress-status">Completed 5/10</span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar"
                                style={{ width: `${progress1 * 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="progress-item">
                    <div className="progress-item-box">
                        <span className="progress-text">LANGUAGE2</span>
                        <div className="progress-completed">
                        <span className="progress-status">Completed 7/10</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${progress2 * 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBox;
