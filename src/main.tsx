import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Docs } from './components/Docks.tsx'
import { Backlog } from './components/Backlog.tsx'
import { Leaderboard } from './components/Leaderboard.tsx'
import { Profile } from './components/Profile.tsx'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/profile/:id',
        element: <Profile />
    },
    {
        path: '/tasks',
        element: <Backlog />
    },
    {
        path: '/leaderboard',
        element: <Leaderboard />
    },
    {
        path: '/docs',
        element: <Docs />
    },

])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
