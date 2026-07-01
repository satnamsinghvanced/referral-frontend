import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
} from "react-icons/hi";

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
  onScheduleClick: () => void;
}

const ViewLeadModal = ({ isOpen, onClose, lead, onScheduleClick }: ViewLeadModalProps) => {
  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0",
        closeButton: "text-white hover:bg-white/20 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <div className="bg-[#0ea5e9] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center font-bold text-lg shrink-0">
                  {lead.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[16px] leading-tight text-white">{lead.patientName}</h3>
                  <p className="text-white/85 text-[13px] mt-0.5">Lead Profile</p>
                </div>
              </div>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
              <div className="flex gap-3">
                <div className="bg-sky-50 dark:bg-sky-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-2">Status</span>
                  <span className="px-2.5 py-0.5 bg-sky-100 dark:bg-sky-900/60 text-sky-500 dark:text-sky-300 text-[11px] rounded-full font-semibold border border-sky-200 dark:border-sky-700/60 whitespace-nowrap">
                    New Lead
                  </span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-1">Lead Score</span>
                  <span className="text-[22px] font-extrabold text-emerald-500 dark:text-emerald-400 leading-none">
                    74
                  </span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl p-3 flex-1 flex flex-col items-center justify-center text-center min-w-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mb-1">Est. Value</span>
                  <span className="text-[18px] font-extrabold text-purple-500 dark:text-purple-400 leading-none">
                    ${lead.estimatedValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                    <HiOutlineMail className="text-slate-400 shrink-0 text-[16px]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Email</div>
                      <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {lead.patientEmail || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                    <HiOutlinePhone className="text-slate-400 shrink-0 text-[16px]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Phone</div>
                      <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                        {lead.patientPhone || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                    <HiOutlineLocationMarker className="text-slate-400 shrink-0 text-[16px]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Location</div>
                      <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {lead.patientLocation || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-default-100/60 px-3 py-2.5 rounded-xl flex gap-2 items-center">
                    <HiOutlineTrendingUp className="text-slate-400 shrink-0 text-[16px]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">Source</div>
                      <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 capitalize">
                        {lead.platform === "web" ? "Website Chat" : lead.platform || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {lead.treatmentInterest && lead.treatmentInterest.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Treatment Interest
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.treatmentInterest.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-[#f5e6ff] dark:bg-purple-950/40 text-[#a855f7] dark:text-purple-300 text-[11px] rounded-md font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 border border-slate-200 dark:border-default-300/50 bg-white dark:bg-default-100/50 text-slate-600 dark:text-slate-300 text-[11.5px] rounded-full font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <Button
                  className="flex-[1.3] font-bold bg-[#00a3e0] text-white text-[12.5px] h-9.5 rounded-lg shadow-none"
                  startContent={<HiOutlineCalendar className="text-[16px] shrink-0" />}
                  onPress={() => {
                    onClose();
                    onScheduleClick();
                  }}
                >
                  Schedule Appointment
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] h-9.5 rounded-lg shadow-none"
                  onPress={onClose}
                >
                  Close
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewLeadModal;
