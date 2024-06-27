import './App.css'

import React, { useState } from 'react'

import { Navbar } from './components/navbar/navbar'
import { Sidebar } from './components/sidebar/sidebar'
import { Editor } from './components/editor/editor'

function App() {
  const [openedFiles, setOpenedFiles] = useState<File[]>([])

  function open_file() {
    const file_input = document.querySelector('.file.input') as HTMLInputElement
    const file = file_input.files?.item(0)

    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)

      setOpenedFiles([...openedFiles, file])
    }
  }

  return (
    <>
      <Navbar open_file={open_file}/>
      <div className='project_editor'>
        <Sidebar openedFiles={openedFiles} />
        <Editor openedFiles={openedFiles}/>
      </div>
    </>
  )
}

export default App
