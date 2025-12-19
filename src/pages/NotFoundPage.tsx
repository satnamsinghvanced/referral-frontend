import { Button } from "@heroui/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-5 items-center justify-center h-screen">
      <h1 className="text-7xl md:text-8xl text-primary font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-gray-700">Sorry, we can&apos;t find that page.</p>
      <Link to="/" aria-label="Go back to Dashboard" className="mt-2">
        <Button
          variant="solid"
          color="primary"
          size="md"
          radius="sm"
          endContent={<FaArrowRightLong />}
        >
          Go back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
