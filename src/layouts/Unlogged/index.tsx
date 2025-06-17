import { Outlet } from 'react-router-dom'
import { Center, Header, TitleSub } from './styles'

const UnloggedLayout = () => (
    <Center>
        <Header>
            <TitleSub>
                <h1>PequiEater</h1>
                <p>Lugar de roer</p>
            </TitleSub>
        </Header>
        <main>
            <Outlet />
        </main>
    </Center>
)

export default UnloggedLayout
