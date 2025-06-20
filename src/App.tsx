import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GlobalStyle } from './styles'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import ProtectedRoute from './components/Protected'
import UnloggedLayout from './layouts/Unlogged'
import LoggedLayout from './layouts/Logged'

function App() {
    return (
        <>
            <GlobalStyle />
            <div className="container">
                <Router>
                    <Routes>
                        <Route element={<UnloggedLayout />}>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            <Route element={<LoggedLayout />}>
                                <Route path="/feed" element={<Feed />} />
                                <Route path="/profile/:userId" element={<Profile />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </div>
        </>
    )
}

export default App
