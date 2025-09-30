import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { IoIosSave } from "react-icons/io";

interface AddModalProps {
    isOpen: boolean;
    heading: any;
    description: string;
    cancelBtnData: {
        text: string;
        function: () => void;
        style?: string;
    };
    addBtnData: {
        text: string;
        function: () => void;
        style?: string;
    };
    config: React.ReactNode;
}

const AddModal = ({ isOpen, heading, description, cancelBtnData, addBtnData, config }: AddModalProps) => {
    return (
        <div className="flex absolute top-0">
            <Modal isOpen={isOpen} onOpenChange={cancelBtnData.function}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className=" flex gap-1.5 flex-col">
                                    <h4 className="text-base font-normal">{heading}</h4>
                                    <p className="text-xs font-extralight text-foreground/90 ">{description}</p>
                                </div>
                            </ModalHeader>

                            <div className=" overflow-y-scroll h-fit max-h-[700px]">
                                <ModalBody className="w-full">

                                    {config}
                                </ModalBody>
                            </div>
                            <ModalFooter>
                                <Button size="sm" color="default" variant="light" onPress={cancelBtnData.function || onClose} className={`capitalize ${cancelBtnData.style}`}>
                                    {cancelBtnData.text}
                                </Button>
                                <Button size="sm" color="default" onPress={addBtnData.function} className={`capitalize ${addBtnData.style}`}>
                                    <IoIosSave />  {addBtnData.text}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AddModal;
