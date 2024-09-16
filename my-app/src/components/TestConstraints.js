import { useState } from 'react';

const TestConstraints = () => {
    // State to hold the status of contraints
    const[ constraints, setConstraints ] = useState({
        print: false,
        loop: false,
    });

    // Function to toggle status of given constraint
    const toggleConstraints = (constraint) => {
       setConstraints(prevState => ({
            // Keep other constraints the same and toggle selected one
            ...prevState,
            [constraint]: !prevState[constraint],
       }));
    };

    // Function to check the submitted code against the active constraints
    const checkConstraints = (code) => {
        const messages = [];

        // If the print constraint is active, check for violations
        if (constraints.print) {
            const printConstraintMessage = PrintConstraints(code);
            if (printConstraintMessage) messages.push(printConstraintMessage);
        }

        // If the for or while loop constraint is active, check for violations
        if (constraints.loop) {
            const loopConstraintMessage = LoopConstraints(code);
            if (loopConstraintMessage) messages.push(loopConstraintMessage);
        }

        return messages.length > 0 ? messages.join(' ') : "Code met all constraints.";
    };

    // Return all violation messages, or success message if no violations
    return { constraints, toggleConstraints, checkConstraints };
};

const PrintConstraints = ( code ) => {
    const printFunctions = [
        'print',                // Python
        'console.log',          // JavaScript
        'System.out.print',     // Java
        'printf',               // C
    ]

    // Combines all possible print functions into a single expression
    const printRegExp = new RegExp(printFunctions.join('|'), 'g');

    // Check if code has a print function
    const hasPrint = printRegExp.test(code);

    // No print function is found
    if (!hasPrint) return null;

    // Check if the code contains other logic besides just printing
    const otherLogicRegex = /[=+\-*/%]|for|while|if|function|return/g;
    const hasOtherLogic = otherLogicRegex.test(code);

    // Alert the user if they have failed to use other logic than just the print function
    if (!hasOtherLogic) {
        return "Please try to use other logic and not just the print function.";
    }

    // Other logic is found
    return null;
};

const LoopConstraints = ( code ) => {
    // Expressions for each loop type
    const forLoop = /for\s*\(.*\)|for\s+[a-zA-Z_]/g;
    const whileLoop = /while\s*\(.*\)|while\s+[a-zA-Z_]/g;

    // Check if the code contains a for or while loop
    const hasForLoop = forLoop.test(code);
    const hasWhileLoop = whileLoop.test(code);

    // If neither loop is found, return the error message
    if (!hasForLoop && !hasWhileLoop) {
        return "You must use a for or while loop to solve this question.";
    }

    // If either loop is found, return null (no constraint violation)
    return null;
};

export default TestConstraints;