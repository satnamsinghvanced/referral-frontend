import { Button, Card, CardBody } from "@heroui/react";
import { FiDownload } from "react-icons/fi";
import { LuCircleCheckBig } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { downloadVcf } from "../../utils/vcfGenerator";

const ThankYouPage = () => {
  const location = useLocation();
  const { user } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto flex justify-center items-center flex-col min-h-screen -mt-16">
        <Card className="shadow-none mb-5 border-0 w-full">
          <CardBody className="p-5">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuCircleCheckBig className="h-7 w-7 text-green-600" />
              </div>
              <h1 className="text-green-800 text-lg font-medium mb-4">
                Thank You!
              </h1>
              <p className="text-xs text-gray-600 mb-6">
                Your referral has been submitted successfully. We'll contact you
                shortly to schedule your consultation.
              </p>
              <p className="text-sm font-medium text-gray-900 mb-4">
                Save Our Contact Information
              </p>
              <Button
                color="primary"
                size="sm"
                radius="sm"
                onPress={() => {
                  downloadVcf({
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    phone: user?.phone,
                    email: user?.email,
                    organization: user?.practiceName,
                  });
                }}
                startContent={<FiDownload className="text-sm" />}
              >
                Download Contact Card
              </Button>
              <div className="space-y-2 bg-blue-50 rounded-lg p-4 text-center mt-6">
                <p className="font-medium text-blue-900 text-sm">
                  What's Next?
                </p>
                <p className="text-blue-800 text-xs">
                  Our team will review your information and contact you within
                  24 hours to schedule your consultation. In the meantime, feel
                  free to call us directly at +1 (555) 123-4567.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ThankYouPage;
