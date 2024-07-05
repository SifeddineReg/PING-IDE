import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Docs } from './components/Docks.tsx'
import { Backlog } from './components/Backlog.tsx'
import { Leaderboard } from './components/Leaderboard.tsx'
import { Profile } from './components/Profile.tsx'
import * as db from '../src/assets/data.json'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

const avgCodeTidiness = db.users.reduce((acc, user) => acc + user.code_tidiness, 0) / db.users.length
const avgTestCoverage = db.users.reduce((acc, user) => acc + user.test_coverage, 0) / db.users.length
const totalTasks = db.tasks.length

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/profile/:id',
        element: <Profile/>
    },
    {
        path: '/tasks',
        element: <Backlog />
    },
    {
        path: '/leaderboard',
        element: <Leaderboard avgCodeTidiness={avgCodeTidiness} avgTestCoverage={avgTestCoverage} totalTasks={totalTasks}/>
    },
    {
        path: '/docs',
        element: <Docs />
    },

])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <RouterProvider router={router} />
    </ThemeProvider>
)
