import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { IoIosSave } from "react-icons/io";

const AddModal = ({ isOpen, heading, description, cancelBtnData, addBtnData, config }) => {
    return (
        <div className="flex absolute top-0 ">
            <Modal isOpen={isOpen} onOpenChange={cancelBtnData.function} >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className=" flex gap-1.5 flex-col">
                                    <h4 className="text-base font-normal">{heading}</h4>
                                    <p className="text-xs font-extralight text-text/90">{description}</p>
                                </div>
                            </ModalHeader>

                            <div className=" overflow-y-scroll h-[700px]">
                                <ModalBody className="">

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
