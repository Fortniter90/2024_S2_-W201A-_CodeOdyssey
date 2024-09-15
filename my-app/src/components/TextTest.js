import TestConstraints from './TestConstraints';
import { useState } from 'react';

const TextTest = () => {
    const [code, setCode] = useState(''); 
    const [message, setMessage] = useState('');
    const { constraints, toggleConstraints, checkConstraints } = TestConstraints(); 

    const handleSubmit = () => {
        const result = checkConstraints(code);
        setMessage(result);
    };

    return (
        <div>
            <h1>Text Test for Constraints</h1>

            <textarea
                rows="5"
                cols="50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
            ></textarea>

            <div>
                <button onClick={handleSubmit}>Submit Code</button>
            </div>

            <div>
                <button onClick={() => toggleConstraints('print')}>
                    {constraints.print ? 'Deactivate Print Constraint' : 'Activate Print Constraint'}
                </button>
                <button onClick={() => toggleConstraints('loop')}>
                    {constraints.loop ? 'Deactivate For or While Loop Constraint' : 'Activate For or While Loop Constraint'}
                </button>
            </div>

            {/* Display the message */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default TextTest;