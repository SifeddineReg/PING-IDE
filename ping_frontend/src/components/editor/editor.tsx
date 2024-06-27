import { useState, useEffect } from 'react'
import './editor.css'
import '../../assets/codemirror.css'
import { Controlled as EditorControlled } from 'react-codemirror2'

export interface EditorProps {
  openedFiles: File[];
}

export const Editor = (props: EditorProps) => {
  const [currentFile, setCurrentFile] = useState<File | null>(props.openedFiles[0] || null);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!currentFile && props.openedFiles.length > 0) {
      setCurrentFile(props.openedFiles[0])
    } else if (currentFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target) {
          setCode(e.target.result as string)
        }
      };
      reader.readAsText(currentFile)
    }
  }, [currentFile, props.openedFiles])

  const handleFileTabClick = (file: File) => {
    setCurrentFile(file);
  };

  return (
    <div className="editor-container">
      <div className="editor-tabs">
        {props.openedFiles.map(file => (
          <button
            key={file.name}
            className={`tab ${currentFile && file.name === currentFile.name ? 'active' : ''}`}
            onClick={() => handleFileTabClick(file)}
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="editor-code">
        <EditorControlled
          onBeforeChange={(_editor, _data, value) => {
            setCode(value);
          }}
          value={code}
          className="editor"
          options={{
            lineWrapping: true,
            lint: true,
            mode: props.openedFiles.length > 0 ? props.openedFiles[0].name.split('.').pop() : 'text',
            lineNumbers: true,
            smartIndent: true,
            indentWithTabs: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};