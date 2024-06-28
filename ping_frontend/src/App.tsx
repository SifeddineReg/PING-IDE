import './App.css'

import { useState } from 'react'

import { Navbar } from './components/navbar/navbar'
import { Sidebar, TreeData } from './components/sidebar/sidebar'
import { Editor } from './components/editor/editor'

function App() {
  const [openedFiles, setOpenedFiles] = useState<File[]>([]);
  const [treeData, setTreeData] = useState<TreeData>({});

  function open_file() {
    const file_input = document.querySelector('.file.input') as HTMLInputElement;
    const file = file_input.files?.item(0);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOpenedFiles(prevFiles => [...prevFiles, file]);
      };
      reader.readAsText(file);
    }
  }

  function organizeTreeStructure(files: File[]): TreeData {
    let tree: TreeData = {};

    files.forEach(file => {
      const parts = file.webkitRelativePath.split('/');
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? file : {};
        }
        current = current[part];
      }
    });

    console.log(tree);

    return tree;
  }

  const open_folder = () => {
    const files = document.querySelector('.folder.input') as HTMLInputElement
    const file = files.files
    if (file) {
      const fileArray = Array.from(file)
      const organizedTree = organizeTreeStructure(fileArray)
      setTreeData(organizedTree)
      setOpenedFiles([])
    }
  };

  const onFileClick = (file: File) => {
    setOpenedFiles(prevFiles => [...prevFiles, file])
  }

  function handleFileClose(fileToClose: File) {
    setOpenedFiles(openedFiles.filter(file => file !== fileToClose));
  }

  return (
    <>
      <Navbar open_file={open_file} open_folder={open_folder}/>
      <div className='project_editor'>
        <Sidebar treeData={treeData} onFileClick={onFileClick} open_file={open_file} open_folder={open_folder}/>
        <Editor openedFiles={openedFiles} onFileClose={handleFileClose} />
      </div>
    </>
  )
}

export default App
