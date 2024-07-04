import { useState, useEffect } from 'react'
import './editor.css'
import '../../assets/codemirror.css'
import 'codemirror/mode/python/python'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/php/php'
import 'codemirror/mode/shell/shell'
import { Controlled as EditorControlled } from 'react-codemirror2'
import { linter } from '@codemirror/lint'

const Linter = async (view: any) => {
  return [{
    from: view.state.doc.line(1).from,
    to: view.state.doc.line(1).to,
    severity: 'error',
    message: 'Example error message',
  }]
}

export interface EditorProps {
  openedFiles: File[];
  onFileClose: (file: File) => void;
}

const ext_to_mode: { [key: string]: string } = {
  'py': 'python',
  'js': 'javascript',
  'html': 'htmlmixed',
  'css': 'css',
  'tsx': 'javascript',
  'cjs': 'javascript',
  'ts': 'javascript',
  'json': 'javascript',
  'xml': 'xml',
  'sql': 'sql',
  'md': 'markdown',
  'java': 'clike',
  'c': 'clike',
  'cc': 'clike',
  'cpp': 'clike',
  'h': 'clike',
  'hh': 'clike',
  'hpp': 'clike',
  'php': 'php',
  'sh': 'shell',
};

export const Editor = (props: EditorProps) => {
  const [currentFile, setCurrentFile] = useState<File | null>(props.openedFiles[0] || null);
  const [code, setCode] = useState('');

  function save_file() {
      const updateRequest = {
          path: currentFile,
          from: 0,
          to: 0,
          content: code,
      };

      fetch(`http://localhost:8080/api/update`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify(updateRequest),
      }).then((response) => {
          console.log(response);
      }).catch((error) => {
          console.error('Error:', error);
      });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        save_file();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentFile, code])

  useEffect(() => {
    if (currentFile && !props.openedFiles.includes(currentFile)) {
      if (props.openedFiles.length > 0) {
        setCurrentFile(props.openedFiles[0]);
      } else {
        setCurrentFile(null);
        setCode('');
      }
    } else if (!currentFile && props.openedFiles.length > 0) {
      setCurrentFile(props.openedFiles[0]);
    } else if (currentFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setCode(e.target.result as string);
        }
      };
      reader.readAsText(currentFile);
    }
  }, [currentFile, props.openedFiles]);

  const handleFileTabClick = (file: File) => {
    setCurrentFile(file);
  };

  const editorContainerClass = [`editor-container ${props.openedFiles.length > 0 ? 'with_tabs' : ''}`].join(' ');

  return (
    <div className={editorContainerClass}>
      <div className="editor-tabs">
        {props.openedFiles.map(file => (
          <div key={file.name} className="tab-wrapper">
            <button
              className={`tab ${currentFile && file.name === currentFile.name ? 'active' : ''}`}
              onClick={() => handleFileTabClick(file)}
            >
              {file.name}
            </button>
            <button
              className="close-tab"
              onClick={(e) => {
                e.stopPropagation()
                props.onFileClose(file)
              }}
            >
              &nbsp;x
            </button>
          </div>
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
            lint: {
              getAnnotations: Linter,
              lintOnChange: true,
            },
            mode: ext_to_mode[currentFile?.name.split('.').pop() as string] || 'text',
            lineNumbers: true,
            smartIndent: true,
            indentWithTabs: true,
            tabSize: 2,
            gutters: ['CodeMirror-lint-markers'],
          }}
        />
      </div>
    </div>
  );
};