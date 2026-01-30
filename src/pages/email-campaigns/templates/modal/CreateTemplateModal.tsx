import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiImage, FiUpload } from "react-icons/fi";
import { LuSave } from "react-icons/lu";
import * as Yup from "yup";
import QuillEditor from "../../../../components/editor/QuillEditor";
import { CAMPAIGN_CATEGORIES } from "../../../../consts/campaign";
import { Media } from "../../../../types/media";
import GalleryMediaUploadModal from "../../../media-management/modal/GalleryMediaUploadModal";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TemplateFormValues) => void;
  initialData?: any;
}

export interface TemplateFormValues {
  name: string;
  description: string;
  category: string;
  subjectLine: string;
  body: string;
  tags: string;
  headerColor: string;
  accentColor: string;
  organizationName: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  coverImage: string;
}

const TemplateValidationSchema = Yup.object().shape({
  name: Yup.string().required("Template Name is required"),
  category: Yup.string().required("Category is required"),
  subjectLine: Yup.string().required("Subject Line is required"),
  body: Yup.string().required("Email Body is required"),
  organizationName: Yup.string().required("Organization Name is required"),
});

export default function CreateTemplateModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateTemplateModalProps) {
  const initialValues: TemplateFormValues = {
    name: initialData?.name || initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "referralOutreach",
    subjectLine: initialData?.subjectLine || "",
    body: initialData?.bodyContent || initialData?.body || "",
    tags: initialData?.tags?.join(", ") || "",
    headerColor:
      initialData?.designOptions?.headerColor ||
      initialData?.headerColor ||
      "#0ea5e9",
    accentColor:
      initialData?.designOptions?.accentColor ||
      initialData?.accentColor ||
      "#f97316",
    organizationName:
      initialData?.designOptions?.organizationName ||
      initialData?.organizationName ||
      "",
    primaryButtonText:
      initialData?.designOptions?.buttonText ||
      initialData?.primaryButtonText ||
      "Call to Action",
    secondaryButtonText:
      initialData?.designOptions?.secondaryButtonText ||
      initialData?.secondaryButtonText ||
      "Secondary Action",
    coverImage: initialData?.mainImage || initialData?.image || "",
  };

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<Media | null>(
    null,
  );

  const formik = useFormik({
    initialValues,
    validationSchema: TemplateValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const replaceVariables = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\[Recipient Name\]/g, "John Doe")
      .replace(/\[Practice Name\]/g, "Smile Dental")
      .replace(/\[Your Name\]/g, "Dr. Smith")
      .replace(/\[City\]/g, "New York")
      .replace(/\[Phone\]/g, "(555) 123-4567")
      .replace(/\[Email\]/g, "contact@smiledental.com");
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="4xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1.5 flex-shrink-0 p-4">
          <h4 className="text-base leading-none font-medium text-foreground">
            Create New Email Template
          </h4>
          <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
            Design a custom email template for your campaigns
          </p>
        </ModalHeader>
        <ModalBody className="p-4 py-0">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
              <div>
                <Input
                  size="sm"
                  radius="sm"
                  label="Template Name"
                  placeholder="e.g., Professional Partnership Invitation"
                  labelPlacement="outside"
                  name="name"
                  isRequired
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.touched.name && formik.errors.name)}
                  errorMessage={formik.errors.name as string}
                />
              </div>
              <div className="relative flex items-start">
                <Select
                  size="sm"
                  radius="sm"
                  label="Category"
                  placeholder="Select a category"
                  labelPlacement="outside"
                  name="category"
                  isRequired
                  selectedKeys={[formik.values.category]}
                  disabledKeys={[formik.values.category]}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("category", Array.from(keys)[0])
                  }
                >
                  {CAMPAIGN_CATEGORIES.map(
                    (cat: { label: string; value: string }) => (
                      <SelectItem key={cat.value}>{cat.label}</SelectItem>
                    ),
                  )}
                </Select>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  size="sm"
                  radius="sm"
                  label="Description"
                  placeholder="Brief description of what this template is for..."
                  labelPlacement="outside"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs mb-1.5 block">Cover Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg px-4 py-6 text-center transition-all duration-200 cursor-pointer ${
                    selectedCoverImage
                      ? "border-green-400 bg-green-50/50 dark:bg-green-500/10 dark:border-green-500/50 hover:border-green-500"
                      : "border-foreground/10 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-content2"
                  }`}
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      {selectedCoverImage ? (
                        <FiCheckCircle className="size-5 text-green-500" />
                      ) : (
                        <>
                          <FiUpload className="size-5 text-gray-400" />
                          <FiImage className="size-5 text-gray-400" />
                        </>
                      )}
                    </div>
                    <div>
                      {selectedCoverImage ? (
                        <p className="text-xs font-medium text-green-700">
                          Cover image selected. Click to change.
                        </p>
                      ) : (
                        <p className="text-xs font-medium">
                          Click to select cover image from gallery or upload
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-foreground/60 mt-1">
                        Recommended: 1200x630px (JPG, PNG, max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Input
                  size="sm"
                  radius="sm"
                  label="Subject Line"
                  placeholder="Enter email subject line..."
                  labelPlacement="outside"
                  name="subjectLine"
                  isRequired
                  value={formik.values.subjectLine}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.touched.subjectLine && formik.errors.subjectLine)
                  }
                  errorMessage={formik.errors.subjectLine as string}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs mb-1.5 block">
                  Email Body <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <QuillEditor
                    value={formik.values.body}
                    onChange={(value) => formik.setFieldValue("body", value)}
                    placeholder="Enter your email content here.. Use [Recipient Name], [Practice Name], etc. for personalization"
                    enableImage={false}
                  />
                </div>
                {!!(formik.touched.body && formik.errors.body) && (
                  <div className="text-xs text-red-500">
                    {formik.errors.body as string}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Available variables: [Recipient Name], [Practice Name], [Your
                  Name], [City], [Phone], [Email]
                </div>
              </div>

              <Input
                size="sm"
                radius="sm"
                label="Tags (comma separated)"
                placeholder="e.g., professional, partnership, introduction"
                labelPlacement="outside"
                name="tags"
                value={formik.values.tags}
                onChange={formik.handleChange}
              />

              <div className="space-y-2">
                <Input
                  size="sm"
                  radius="sm"
                  label="Organization Name"
                  placeholder="Your Practice Name"
                  labelPlacement="outside"
                  name="organizationName"
                  isRequired
                  value={formik.values.organizationName}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.touched.organizationName &&
                      formik.errors.organizationName
                    )
                  }
                  errorMessage={formik.errors.organizationName as string}
                />
                <div className="text-[11px] text-gray-500">
                  This will appear in the email header and footer
                </div>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <h5 className="text-sm font-medium">Design Options</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs">Header Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-8 rounded border border-foreground/50 cursor-pointer relative"
                        style={{ backgroundColor: formik.values.headerColor }}
                      >
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={formik.values.headerColor}
                          onChange={(e) =>
                            formik.setFieldValue("headerColor", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        size="sm"
                        radius="sm"
                        value={formik.values.headerColor}
                        onChange={(e) =>
                          formik.setFieldValue("headerColor", e.target.value)
                        }
                        className="max-w-[120px]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-8 rounded border border-foreground/50 cursor-pointer relative"
                        style={{ backgroundColor: formik.values.accentColor }}
                      >
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={formik.values.accentColor}
                          onChange={(e) =>
                            formik.setFieldValue("accentColor", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        size="sm"
                        radius="sm"
                        value={formik.values.accentColor}
                        onChange={(e) =>
                          formik.setFieldValue("accentColor", e.target.value)
                        }
                        className="max-w-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Input
                size="sm"
                radius="sm"
                label="Primary Button Text"
                placeholder="Call to Action"
                labelPlacement="outside"
                name="primaryButtonText"
                value={formik.values.primaryButtonText}
                onChange={formik.handleChange}
              />
              <Input
                size="sm"
                radius="sm"
                label="Secondary Button Text"
                placeholder="Secondary Action"
                labelPlacement="outside"
                name="secondaryButtonText"
                value={formik.values.secondaryButtonText}
                onChange={formik.handleChange}
              />
            </div>

            {/* Template Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-2.5">
                <h3 className="text-sm font-medium">Live Template Preview</h3>
              </div>
              <div className="border border-foreground/10 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
                {/* Email Header */}
                <div
                  className="p-3.5 text-center text-white"
                  style={{ backgroundColor: formik.values.headerColor }}
                >
                  <h2 className="text-md font-medium">
                    {formik.values.organizationName || "Your Practice Name"}
                  </h2>
                </div>

                {/* Cover Image in Preview */}
                {/* {formik.values.coverImage && (
                  <div className="w-full h-48 md:h-64 overflow-hidden border-b border-foreground/5">
                    <img
                      src={formik.values.coverImage}
                      alt="Template Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )} */}

                {/* Email Content */}
                <div className="px-4 py-5 space-y-4 text-foreground min-h-[200px]">
                  <div className="pb-4 border-b border-foreground/5 space-y-1">
                    <p className="text-xs text-gray-400">Subject Line:</p>
                    <p className="text-sm font-medium">
                      {formik.values.subjectLine ||
                        "Your subject line will appear here"}
                    </p>
                  </div>
                  <div
                    className="text-sm prose dark:prose-invert prose-sm max-w-none leading-[1.6]"
                    dangerouslySetInnerHTML={{
                      __html:
                        formik.values.body ||
                        "Your email body content will be displayed here with proper formatting and personalization variables. Start typing in the Email Body field to see your message come to life!",
                    }}
                  />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      className="text-xs px-3.5 py-2 rounded-lg text-white transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                      style={{ backgroundColor: formik.values.accentColor }}
                    >
                      {formik.values.primaryButtonText || "Call to Action"}
                    </button>
                    {formik.values.secondaryButtonText && (
                      <button
                        type="button"
                        className="text-xs px-3.5 py-2 rounded-lg border-1 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer"
                        style={{
                          borderColor: "#e5e7eb",
                          color: "inherit",
                        }}
                      >
                        {formik.values.secondaryButtonText}
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Footer */}
                <div className="p-3.5 text-center text-xs text-gray-400 border-t border-foreground/5 bg-gray-50 dark:bg-zinc-800/50">
                  <p className="mb-1 font-medium text-gray-500">
                    {formik.values.organizationName || "Your Practice Name"}
                  </p>
                  <p>© 2026 All Rights Reserved - Unsubscribe</p>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            onPress={onClose}
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            radius="sm"
            size="sm"
            variant="solid"
            color="primary"
            onPress={() => formik.handleSubmit()}
            startContent={<LuSave className="size-3.5" />}
          >
            Create Template
          </Button>
        </ModalFooter>
      </ModalContent>

      <GalleryMediaUploadModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(media: Media[]) => {
          const selectedImage = media[0];
          if (selectedImage) {
            setSelectedCoverImage(selectedImage);
            formik.setFieldValue("coverImage", selectedImage.path);
          }
        }}
        preselectedMedia={selectedCoverImage ? [selectedCoverImage] : []}
        allowedImageFormats={["image/jpeg", "image/png", "image/webp"]}
        maxImageSize={5 * 1024 * 1024}
        allowedVideoFormats={[]}
        maxVideoSize={0}
        maxSelection={1}
      />
    </Modal>
  );
}
