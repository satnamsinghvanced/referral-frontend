import { Modal, ModalContent, ModalBody, Button, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import { HiOutlinePaperAirplane, HiOutlineCurrencyDollar } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";

interface SendQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
  onSendQuote?: (text: string) => void;
}

interface LineItem {
  id: string;
  name: string;
  description: string;
  fee: string;
  discount: string;
}

const SendQuoteModal = ({ isOpen, onClose, lead, onSendQuote }: SendQuoteModalProps) => {
  if (!lead) return null;

  const validationSchema = Yup.object().shape({
    lineItems: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Treatment name is required"),
        description: Yup.string().nullable(),
        fee: Yup.number().typeError("Must be a number").min(0).required("Required"),
        discount: Yup.number().typeError("Must be a number").min(0).required("Required"),
      })
    ),
    personalNote: Yup.string().max(500, "Notes too long").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      lineItems: [] as LineItem[],
      personalNote: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const total = Math.max(0, subtotal - discounts);
      const itemsText = values.lineItems.map(item => `${item.name || "Treatment"} ($${item.fee})`).join(", ");
      const msgText = `Here is your treatment quote:\n${itemsText || "No items listed"}\nTotal Quote: $${total.toLocaleString()}${values.personalNote ? `\nNote: ${values.personalNote}` : ""}`;
      
      if (onSendQuote) {
        onSendQuote(msgText);
      }

      addToast({
        title: "Quote Sent",
        description: `Successfully sent a quote of $${total.toLocaleString()} to ${lead.patientName}.`,
        color: "success",
      });
      onClose();
      formik.resetForm();
    },
  });

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      fee: "0",
      discount: "0",
    };
    formik.setFieldValue("lineItems", [...formik.values.lineItems, newItem]);
  };

  const deleteItem = (id: string) => {
    formik.setFieldValue(
      "lineItems",
      formik.values.lineItems.filter((item) => item.id !== id)
    );
  };

  const handleItemChange = (id: string, field: keyof LineItem, val: string) => {
    formik.setFieldValue(
      "lineItems",
      formik.values.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      )
    );
  };

  const subtotal = formik.values.lineItems.reduce(
    (acc, item) => acc + (parseFloat(item.fee) || 0),
    0
  );
  const discounts = formik.values.lineItems.reduce(
    (acc, item) => acc + (parseFloat(item.discount) || 0),
    0
  );
  const total = Math.max(0, subtotal - discounts);
  const monthlyFinance = Math.round(total / 24);

  const inputClass =
    "w-full text-[13px] text-slate-700 dark:text-slate-200 outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-default-200 rounded-lg px-3 h-9 focus:border-[#f97316] transition-colors";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!mx-3 max-sm:!my-4 !m-0 w-full max-w-[480px]",
        closeButton: "text-white hover:bg-white/20 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden bg-white dark:bg-content1">
        {(onClose) => (
          <>
            <div className="bg-[#f97316] px-5 py-4 text-white">
              <h3 className="font-bold text-[16px] leading-tight text-white">Treatment Quote</h3>
              <p className="text-white/85 text-[13px] mt-0.5">For: {lead.patientName}</p>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Line Items
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-[13px] font-semibold text-[#f97316] hover:opacity-75 transition-opacity"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {formik.values.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 dark:border-default-200 rounded-xl p-4 flex flex-col gap-2 bg-white dark:bg-default-50/30"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Treatment name"
                          className={`flex-1 text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none bg-transparent placeholder:text-slate-400 border border-slate-200 dark:border-default-200 rounded-lg px-3 h-9 focus:border-[#f97316] transition-colors`}
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-[18px] leading-none shrink-0 w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Description (optional)"
                        className={`text-[12.5px] text-slate-500 dark:text-slate-400 outline-none bg-transparent placeholder:text-slate-400 border border-slate-200 dark:border-default-200 rounded-lg px-3 h-8 w-full focus:border-[#f97316] transition-colors`}
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                            Fee ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className={inputClass}
                            value={item.fee}
                            onChange={(e) => handleItemChange(item.id, "fee", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                            Discount ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className={inputClass}
                            value={item.discount}
                            onChange={(e) => handleItemChange(item.id, "discount", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-default-100/50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-600 dark:text-slate-300">Subtotal</span>
                  <span className="text-[13px] text-slate-700 dark:text-slate-200 font-medium">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-default-200">
                  <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold">Discounts</span>
                  <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    -${discounts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Total</span>
                  <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-sky-50 dark:bg-sky-950/20 rounded-xl p-4 flex gap-3 border border-sky-100 dark:border-sky-900/40">
                <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center shrink-0 mt-0.5">
                  <HiOutlineCurrencyDollar className="text-sky-500 text-[14px]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-sky-600 dark:text-sky-400">
                    Flexible financing available
                  </div>
                  <div className="text-[11.5px] text-sky-500 dark:text-sky-400/80 mt-0.5 leading-relaxed">
                    As low as{" "}
                    <span className="font-bold">${monthlyFinance}/mo</span>{" "}
                    with 0% interest for 24 months through CareCredit or Orthodontic Financing.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                  Personal Note (Optional)
                </label>
                <textarea
                  name="personalNote"
                  rows={3}
                  placeholder="Add a personalized message to accompany the quote..."
                  className="w-full text-[12.5px] text-slate-700 dark:text-slate-200 outline-none bg-transparent placeholder:text-slate-400 border border-slate-200 dark:border-default-200 rounded-lg px-3 py-2.5 resize-none focus:border-[#f97316] transition-colors"
                  value={formik.values.personalNote}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="bg-slate-50 dark:bg-default-100/40 px-4 py-3 rounded-xl border border-slate-100 dark:border-default-200/50">
                <div className="text-[12px] text-slate-600 dark:text-slate-300">
                  Quote sent via: <span className="font-bold">SMS + Email</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Patient can accept online. Quote valid for 30 days.
                </div>
              </div>

              <div className="flex gap-2.5 pb-1">
                <Button
                  className="flex-[2] font-bold bg-[#f97316] text-white text-[13px] h-9 rounded-lg"
                  startContent={<HiOutlinePaperAirplane className="text-[15px] shrink-0 rotate-45" />}
                  onPress={() => formik.handleSubmit()}
                >
                  Send Quote
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[13px] h-9 rounded-lg"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SendQuoteModal;
