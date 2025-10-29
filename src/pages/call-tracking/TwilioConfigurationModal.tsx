import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { FiExternalLink, FiInfo } from "react-icons/fi";

// The main Modal component using the Hero UI structure
export default function TwilioConfigurationModal({ isOpen, onClose }: any) {
  const [formData, setFormData] = useState({
    accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authToken: "securetoken12345",
    phoneNumber: "+15551234567",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Configuration Saved:", formData);
    onClose();
  };

  return (
    // Set size to 'md' or 'lg' to fit the content, replicating the image width
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
    >
      <ModalContent>
        {/* Modal Header */}
        <ModalHeader className="p-5 pb-0 flex-col">
          <h2
            data-slot="dialog-title"
            className="leading-none font-medium text-base"
          >
            Twilio Configuration
          </h2>
          <p
            data-slot="dialog-description"
            className="text-xs text-gray-600 mt-2 font-normal"
          >
            Configure your Twilio account credentials to enable call tracking
            and recording features.
          </p>
        </ModalHeader>

        {/* Modal Body */}
        <ModalBody className="px-5 py-5">
          <div className="space-y-4">
            <Input
              size="sm"
              radius="sm"
              label="Account SID"
              labelPlacement="outside-top"
              name="accountSid"
              type="text"
              value={formData.accountSid}
              onChange={handleChange}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />

            <Input
              size="sm"
              radius="sm"
              label="Auth Token"
              labelPlacement="outside-top"
              name="authToken"
              type="password"
              value={formData.authToken}
              onChange={handleChange}
              placeholder="••••••••••••••••••••••••••••••••"
            />

            <Input
              size="sm"
              radius="sm"
              label="Twilio Phone Number"
              labelPlacement="outside-top"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+15551234567"
              isReadOnly={true} // As per the image, this field looks read-only/pre-filled
            />

            {/* Information Box - Matches styling from the image */}
            <div className="text-sm text-gray-700 bg-blue-50 p-3.5 rounded-lg border border-blue-200 mt-4">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold mb-1.5 text-gray-900">
                    Where to find these credentials:
                  </p>
                  <ul className="text-xs space-y-1 ml-1 text-gray-700">
                    <li className="flex items-center gap-1">
                      • Account SID & Auth Token:
                      <a
                        href="https://console.twilio.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Twilio Console
                        <FiExternalLink className="inline-block h-3 w-3 ml-1" />
                      </a>
                    </li>
                    <li>
                      • Phone Number: Active Twilio phone number from your
                      account
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        {/* Modal Footer */}
        <ModalFooter className="flex justify-end gap-2 px-5 pb-5 pt-0">
          {/* Cancel Button */}
          <Button
            size="sm" // Adjusted size for better visual weight
            variant="ghost"
            onPress={onClose}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>

          {/* Save Button (Primary) */}
          <Button
            size="sm"
            variant="solid"
            color="primary" // Assuming 'primary' maps to the bright blue color
            onPress={handleSave}
          >
            Save Configuration
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
