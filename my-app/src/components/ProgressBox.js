import React, { useState } from "react";
import "./ProgressBox.css";

const ProgressBox = () => {
    /* change UseState value based on completion of progress from 0-10, 0 = empty, 10 = full */ 
    const [progress1] = useState(5); 
    const [progress2] = useState(7);

    return (
        <div className="progress-box">
            <div className="progress-tab">
                <span className="tab-text">PROGRESS</span>
            </div>
            <div className="progress-content">
                <div className="progress-item">
                    <div className="progress-item-box progress-item-box1">
                        <span className="progress-text">Python</span>
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
                    <div className="progress-item-box progress-item-box2">
                        <span className="progress-text">JavaScript</span>
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
