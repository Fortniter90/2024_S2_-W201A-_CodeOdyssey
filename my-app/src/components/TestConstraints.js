import { useState } from 'react';

const TestConstraints = () => {
    const[ constraints, setConstraints ] = useState({
        print: false,
        loop: false,
    });

    const toggleConstraints = (constraint) => {
       setConstraints(prevState => ({
            ...prevState,
            [constraint]: !prevState[constraint],
       }));
    };

    const checkConstraints = (code) => {
        const messages = [];

        if (constraints.print) {
            const printConstraintMessage = PrintConstraints(code);
            if (printConstraintMessage) messages.push(printConstraintMessage);
        }

        if (constraints.loop) {
            const loopConstraintMessage = LoopConstraints(code);
            if (loopConstraintMessage) messages.push(loopConstraintMessage);
        }

        return messages.length > 0 ? messages.join(' ') : "Code met all constraints.";
    };

    return { constraints, toggleConstraints, checkConstraints };
};

const PrintConstraints = ( code ) => {
    if (code.includes('print')) {
        return "Please use other logic and not just the print function.";
    }

    return null;
};

const LoopConstraints = ( code ) => {
    if (!code.includes('for') || !code.includes('while')) {
        return "You must use a for or while loop to solve this question.";
    }

    return null;
};

export default TestConstraints;