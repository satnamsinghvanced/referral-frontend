import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { LuShield } from 'react-icons/lu';

const SuperAdminLogin = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const loginClick = () => {
        onOpenChange(false);
    };

    return (
        <>
            <Button isIconOnly={true} className="p-0 m-0 bg-transparent" onPress={onOpen} disableAnimation={true}>
                <LuShield />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Super Admin Login</ModalHeader>
                            <ModalBody>

                                Super AdminLogin clicked
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={loginClick}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default SuperAdminLogin