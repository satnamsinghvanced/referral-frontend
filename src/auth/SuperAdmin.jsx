import { Button } from '@heroui/react'
import { LuShield } from 'react-icons/lu'

const SuperAdminLogin = () => {

    const loginClick = () => {
        alert("Super AdminLogin clicked");
    };

    return (
        <Button isIconOnly={true} className="p-0 m-0 bg-transparent" onPress={loginClick} size="" disableAnimation={true}>
            <LuShield />
        </Button>
    )
}

export default SuperAdminLogin