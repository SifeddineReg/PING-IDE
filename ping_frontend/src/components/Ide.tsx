import { useState } from 'react'

import { Navbar } from './navbar/navbar'
import { Sidebar, TreeData } from './sidebar/sidebar'
import { Editor } from './editor/editor'

export interface MyFile {
  absolutePath: string;
  name: string;
  content: string;
}

function Ide() {
  const [openedFiles, setOpenedFiles] = useState<MyFile[]>([]);
  const [treeData, setTreeData] = useState<TreeData>({});

  async function open_file() {
    await fetch('/api/open/file', {
      method: 'GET',
    }).then(response => {
      return response.json();
    }).then(data => {
      setOpenedFiles(prevFiles => [...prevFiles, data]);
    }).catch(error => {
      console.error('Error:', error);
    });
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

  const onFileClick = (file: MyFile) => {
    setOpenedFiles(prevFiles => [...prevFiles, file])
  }

  function handleFileClose(fileToClose: MyFile) {
    setOpenedFiles(openedFiles.filter(file => file !== fileToClose));
  }

  return (
    <>
      <Navbar open_file={open_file} open_folder={open_folder}/>
      <div className='project_editor'>
        <Sidebar treeData={treeData} onFileClick={onFileClick}/>
        <Editor openedFiles={openedFiles} onFileClose={handleFileClose} />
      </div>
    </>
  )
}

export default Ide
