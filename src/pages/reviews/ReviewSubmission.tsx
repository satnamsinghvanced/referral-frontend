import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FiLoader, FiMessageCircle } from "react-icons/fi";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  useFetchNFCDeskById,
  useScanNFCDesk,
  useSubmitNFCReview,
} from "../../hooks/useNFCDesk";

const ReviewSchema = Yup.object().shape({
  locationId: Yup.string().required("Please select a location"),
  review: Yup.string()
    .required("Please enter your review")
    .min(10, "Review must be at least 10 characters"),
});

const ReviewSubmission = () => {
  const { tagId } = useParams<{
    tagId: string;
    type: string;
    nfcId: string;
  }>();

  const { data: tagResponse, isLoading: isTagLoading } = useFetchNFCDeskById(
    tagId || ""
  );
  const { mutate: scanTag } = useScanNFCDesk();
  const { mutateAsync: submitReview, isPending: isSubmitting } =
    useSubmitNFCReview();

  const tag = tagResponse?.data || tagResponse;
  const locations = tag?.locations || [];

  useEffect(() => {
    if (tagId) {
      const scanKey = `scan_${tagId}`;
      if (!sessionStorage.getItem(scanKey)) {
        scanTag(tagId);
        sessionStorage.setItem(scanKey, "true");
      }
    }
  }, [tagId, scanTag]);

  const formik = useFormik({
    initialValues: {
      locationId: "",
      review: "",
    },
    validationSchema: ReviewSchema,
    onSubmit: async (values) => {
      if (!tagId) return;
      try {
        await submitReview({
          tagId,
          payload: {
            locationId: values.locationId,
            review: values.review,
          },
        });
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    },
  });

  if (isTagLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 flex items-center justify-center p-4">
        <FiLoader className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-foreground">
            Tag not found
          </h2>
          <p className="text-gray-500 dark:text-foreground/60 mt-2">
            The link you followed seems to be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <Card className="shadow-sm border-none overflow-hidden dark:bg-content1">
          <div className="bg-gradient-to-l from-green-600 to-blue-600 px-5 py-4 text-white">
            <h1 className="text-lg font-medium flex items-center justify-start gap-2">
              <FiMessageCircle /> Leave a Review
            </h1>
            <p className="text-sm text-white/90 mt-1">
              {tag.name} - We value your feedback!
            </p>
          </div>
          <CardBody className="p-5 gap-6">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-5"
            >
              <div className="space-y-2">
                <Select
                  placeholder="Choose a location"
                  label="Select Location"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  selectedKeys={
                    formik.values.locationId ? [formik.values.locationId] : []
                  }
                  disabledKeys={
                    formik.values.locationId ? [formik.values.locationId] : []
                  }
                  onSelectionChange={(keys) => {
                    formik.setFieldValue("locationId", Array.from(keys)[0]);
                  }}
                  onBlur={() => formik.setFieldTouched("locationId", true)}
                  isInvalid={
                    !!(formik.touched.locationId && formik.errors.locationId)
                  }
                  errorMessage={
                    formik.touched.locationId && formik.errors.locationId
                  }
                  isRequired
                  classNames={{ label: "font-medium" }}
                >
                  {locations.map((loc: any) => (
                    <SelectItem key={loc._id} textValue={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Textarea
                  label="Your Review"
                  labelPlacement="outside-top"
                  size="sm"
                  placeholder="Share your experience with us..."
                  rows={5}
                  value={formik.values.review}
                  onValueChange={(val) => formik.setFieldValue("review", val)}
                  onBlur={formik.handleBlur}
                  name="review"
                  isInvalid={!!(formik.touched.review && formik.errors.review)}
                  errorMessage={formik.touched.review && formik.errors.review}
                  radius="sm"
                  classNames={{ label: "font-medium", inputWrapper: "py-2" }}
                  isRequired
                />
              </div>

              <Button
                type="submit"
                color="primary"
                size="sm"
                radius="sm"
                isLoading={isSubmitting}
                isDisabled={!formik.isValid || !formik.dirty}
              >
                Submit Review
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ReviewSubmission;
