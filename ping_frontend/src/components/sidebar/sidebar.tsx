import './sidebar.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export interface SidebarProps {
  openedFiles: File[];
}

export const Sidebar = ({openedFiles}: SidebarProps) => {
  return (
    <div className="sidebar">
      <div className="project_name">
        <h3>Project</h3>
        <div className="project_add">
          <i className="bi bi-file-earmark"></i>
          <i className="bi bi-folder"></i>
        </div>
      </div>

      <div className="project_tree">
        {openedFiles.map(file => (
          <div key={file.name}>{file.name}</div>
        ))}
      </div>
    </div>
  )
}