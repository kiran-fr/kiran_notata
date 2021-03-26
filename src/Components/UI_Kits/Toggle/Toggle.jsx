import React, { useState } from 'react';
import './style.css';

const Toggle = () => {
    return (
        <div>
            <div>
                <i class="fa fa-signal" style={{ fontSize: "20px", color: "red" }} />
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
}

export default Toggle;