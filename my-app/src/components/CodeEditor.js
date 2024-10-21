import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/min/vs/editor/editor.main.css';

const CodeEditor = ({ onCodeChange, code }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize the Monaco Editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: code,
      language: 'java',
      automaticLayout: true,
      theme: 'vs-light',
    });

    // Event listener to notify parent component about code changes
    editorRef.current.onDidChangeModelContent(() => {
      onCodeChange(editorRef.current.getValue());
    });

    return () => {
      editorRef.current.dispose();
    };
  }, [onCodeChange]);

  useEffect(() => {
    // Update the editor's value if the code prop changes
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '50vh',
        width: '80%',
        border: '1px solid #ccc',
      }}
    />
  );
};

export default React.memo(CodeEditor);