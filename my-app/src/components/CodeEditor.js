import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/min/vs/editor/editor.main.css';

const CodeEditor = ({ onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize the Monaco Editor
    editorRef.current = monaco.editor.create(document.getElementById('container'), {
      value: '// CODE HERE GOOD\n',
      language: 'java',
      automaticLayout: true,
      theme: 'vs-light',
    });

    // Event listener to notify parent component about code changes
    editorRef.current.onDidChangeModelContent(() => {
      onCodeChange(editorRef.current.getValue()); // Send updated code to parent component
    });

    return () => {
      editorRef.current.dispose();
    };
  }, [onCodeChange]);

  return (
    <div
      id="container"
      style={{
        height: '50vh',
        width: '50%',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default CodeEditor;