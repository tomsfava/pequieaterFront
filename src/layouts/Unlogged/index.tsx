import { Outlet } from 'react-router-dom'

const UnloggedLayout = () => (
    <div>
        <header>
            <h1>PequiEater</h1>
        </header>
        <main>
            <Outlet />
        </main>
    </div>
)

export default UnloggedLayout
