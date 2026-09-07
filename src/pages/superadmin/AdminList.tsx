import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setCredentials } from "../../store/authSlice";
import { FiSearch, FiUsers, FiDollarSign } from "react-icons/fi";
import { addToast } from "@heroui/react";

import { ClientAccount, StatsSummary } from "../../types/superadmin";
import {
  fetchSuperAdminList,
  fetchSuperAdminDetail,
  impersonateClientAccount,
  updateClientNotesAndTags,
} from "../../services/superadmin";
import { formatRelativeTime } from "./utils";
import SuperAdminHeader from "./components/SuperAdminHeader";
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import StatsCards from "./components/StatsCards";
import CustomSelect from "./components/CustomSelect";
import ClientTable from "./components/ClientTable";
import ClientDetailsModal from "./components/ClientDetailsModal";
import PlansFeaturesTab from "./components/PlansFeaturesTab";
import PhonePlansTab from "./components/PhonePlansTab";
import SpecialtiesTab from "./components/SpecialtiesTab";

const AdminList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.ui);
  const isLight = theme === "light";
  const [searchParams] = useSearchParams();
  const getTabFromUrl = (
    param: string | null
  ): "clients" | "plans" | "phonePlans" | "specialties" => {
    if (param === "plans") return "plans";
    if (param === "phone-plans" || param === "phonePlans") return "phonePlans";
    if (param === "specialties" || param === "speciality" || param === "specialities") return "specialties";
    return "clients";
  };

  const [activeMainTab, setActiveMainTab] = useState<"clients" | "plans" | "phonePlans" | "specialties">(getTabFromUrl(searchParams.get("tab")));
  useEffect(() => {
    setActiveMainTab(getTabFromUrl(searchParams.get("tab")));
  }, [searchParams]);
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [notesSaved, setNotesSaved] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetchSuperAdminList();
      const responseData = res?.data || res;
      const fetched = Array.isArray(responseData) ? responseData : responseData?.admins || [];
      if (Array.isArray(fetched)) {
        const formatted: ClientAccount[] = fetched.map((admin: any, index: number) => {
          const firstLetter = (admin.firstName?.[0] || admin.practiceName?.[0] || "A").toUpperCase();
          const secondLetter = (admin.lastName?.[0] || admin.practiceName?.[1] || "C").toUpperCase();
          const initials = `${firstLetter}${secondLetter}`;
          const planStatus = admin.plan?.status;
          const status = !admin.isActive ? "Suspended" : planStatus === "trial" ? "Trial" : planStatus === "past_due" ? "Past Due" : "Active";
          let statusSubtext = (admin as any).statusSubtext || "";
          if (status === "Trial") {
            const trialEnd = admin.plan?.trialEndsAt || (admin as any).trialEndsAt;
            if (trialEnd) {
              const formatted = new Date(trialEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              statusSubtext = `ends ${formatted}`;
            } else {
              statusSubtext = "buy plan trial";
            }
          } else if (status === "Past Due") {
            const overdueDays = (admin as any).overdueDays || admin.plan?.overdueDays || 12;
            statusSubtext = `${overdueDays}d overdue`;
          }
          const planName = admin.plan?.name || "Growth";
          const email = admin.email || "";
          const phone = admin.mobile || admin.phone || "";
          const location = admin.city && admin.state ? `${admin.city}, ${admin.state}` : admin.specialty?.name || "Phoenix, AZ";
          const joinedDate = admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", }) : "Recent";
          const lastActiveTime = admin.updatedAt || admin.createdAt || new Date().toISOString();
          return {
            id: admin._id || String(index + 1),
            displayClientId: `cli_${String(index + 1).padStart(3, "0")}`,
            initials,
            practiceName: admin.practiceName || `${admin.firstName || "Client"} ${admin.lastName || "Practice"}`,
            owner: admin.firstName && admin.lastName ? `Dr. ${admin.firstName} ${admin.lastName}` : "Dr. Practice Owner",
            email,
            phone,
            location,
            status: status as any,
            statusSubtext,
            plan: (planName.includes("Scale")
              ? "Scale"
              : planName.includes("Enterprise")
                ? "Enterprise"
                : planName.includes("Starter")
                  ? "Starter"
                  : "Growth") as any,
            mrr: admin.plan?.price ? Number(admin.plan.price) : 0,
            lastActive: formatRelativeTime(lastActiveTime),
            updatedAt: lastActiveTime,
            nextBillingDate: admin.plan?.nextBillingDate,
            leads: admin.totalLeads ?? admin.leads,
            referrals: admin.totalReferrals ?? admin.referrals,
            reviewScore: admin.reviewScore,
            joinedDate,
            assignedRep: admin.assignedRep,
            tags: Array.isArray(admin.tags) && admin.tags.length > 0 ? admin.tags : undefined,
            internalNotes: admin.internalNotes || admin.notes || undefined,
          };
        });
        setClientAccounts(formatted);
      }
    } catch (error: any) {
      console.error("Failed to fetch admins from API:", error);
      addToast({
        title: "Error",
        description: "Failed to fetch client accounts",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async (client: ClientAccount) => {
    try {
      setImpersonatingId(client.id);
      const targetEmail = client.email || `${client.practiceName.toLowerCase().replace(/\s+/g, "")}@example.com`;
      const responsePayload = await impersonateClientAccount({
        adminId: client.id,
        email: targetEmail,
      });
      const accessToken = responsePayload?.accessToken;
      const refreshToken = responsePayload?.refreshToken;
      const impersonatedUser = responsePayload?.user;
      if (accessToken) {
        const currentToken = localStorage.getItem("token");
        const currentRefreshToken = localStorage.getItem("refreshToken");
        const currentUser = localStorage.getItem("user");
        if (currentToken) localStorage.setItem("admin_token", currentToken);
        if (currentRefreshToken) localStorage.setItem("admin_refreshToken", currentRefreshToken);
        if (currentUser) localStorage.setItem("admin_user", currentUser);
        localStorage.setItem(
          "impersonated_client",
          JSON.stringify({
            id: client.id,
            practiceName: client.practiceName,
            doctorName: (client as any).doctorName || "",
            email: targetEmail,
          })
        );
        localStorage.setItem("token", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (impersonatedUser) localStorage.setItem("user", JSON.stringify(impersonatedUser));
        dispatch(
          setCredentials({
            user: impersonatedUser,
            token: accessToken,
          } as any)
        );
        addToast({
          title: "Impersonation Successful",
          description: `Logged in as ${client.practiceName}`,
          color: "success",
        });
        window.location.href = "/";
      } else {
        addToast({
          title: "Impersonation Failed",
          description: responsePayload?.message || "Failed to log in as client user.",
          color: "danger",
        });
      }
    } catch (error: any) {
      console.error("Impersonation error:", error);
      addToast({
        title: "Impersonation Error",
        description: error.response?.data?.message || error.message || "Failed to log in as target client user.",
        color: "danger",
      });
    } finally {
      setImpersonatingId(null);
    }
  };

  const [drawerInitialTab, setDrawerInitialTab] = useState<"overview" | "phoneService" | "notes">("overview");

  const handleOpenDrawer = async (client: ClientAccount, initialTab: "overview" | "phoneService" | "notes" = "overview") => {
    setSelectedClient(client);
    setDrawerInitialTab(initialTab);
    setNotesInput(client.internalNotes || "");
    setNotesSaved(true);
    setNewTagInput("");
    setIsDrawerOpen(true);
    setModalLoading(true);
    try {
      const res = await fetchSuperAdminDetail(client.id);
      const data = res?.data || res;
      if (data) {
        const fetchedTags = Array.isArray(data.tags) ? data.tags : client.tags || [];
        const fetchedNotes = data.internalNotes || client.internalNotes || "";
        setSelectedClient((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            leads: data.leads ?? prev.leads ?? 0,
            referrals: data.referrals ?? prev.referrals ?? 0,
            reviewScore: data.reviewScore ?? prev.reviewScore ?? "0 ★",
            phoneService: data.phoneService || data.telecom || null,
            telecom: data.phoneService || data.telecom || null,
            tags: fetchedTags,
            internalNotes: fetchedNotes,
          };
        });
        setNotesInput(fetchedNotes);
        setNotesSaved(true);
      }
    } catch (err) {
      console.error("Failed to fetch client details from API:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!selectedClient) return;
    const formattedTag = newTagInput.toLowerCase().trim().replace(/\s+/g, "-");
    if (!formattedTag) return;
    const currentTags = selectedClient.tags || [];
    if (currentTags.includes(formattedTag)) {
      setNewTagInput("");
      return;
    }
    const updatedTags = [...currentTags, formattedTag];
    setSelectedClient((prev) => (prev ? { ...prev, tags: updatedTags } : null));
    setClientAccounts((prev) =>
      prev.map((acc) => (acc.id === selectedClient.id ? { ...acc, tags: updatedTags } : acc))
    );
    setNewTagInput("");
    try {
      await updateClientNotesAndTags(selectedClient.id, { tags: updatedTags });
      addToast({
        title: "Tag Added",
        description: `Added tag '${formattedTag}'`,
        color: "success",
      });
    } catch (err) {
      console.error("Failed to add tag:", err);
      addToast({ title: "Error", description: "Failed to add tag", color: "danger" });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!selectedClient) return;
    const currentTags = selectedClient.tags || [];
    const updatedTags = currentTags.filter((t) => t !== tagToRemove);
    setSelectedClient((prev) => (prev ? { ...prev, tags: updatedTags } : null));
    setClientAccounts((prev) =>
      prev.map((acc) => (acc.id === selectedClient.id ? { ...acc, tags: updatedTags } : acc))
    );
    try {
      await updateClientNotesAndTags(selectedClient.id, { tags: updatedTags });
      addToast({
        title: "Tag Removed",
        description: `Removed tag '${tagToRemove}'`,
        color: "success",
      });
    } catch (err) {
      console.error("Failed to remove tag:", err);
      addToast({
        title: "Error",
        description: "Failed to remove tag",
        color: "danger",
      });
    }
  };

  const handleSaveNotes = async (customNotes?: string) => {
    if (!selectedClient) return;
    const finalNotes = customNotes !== undefined ? customNotes : notesInput;
    try {
      setSavingNotes(true);
      await updateClientNotesAndTags(selectedClient.id, { internalNotes: finalNotes });
      setSelectedClient((prev) => (prev ? { ...prev, internalNotes: finalNotes } : null));
      setClientAccounts((prev) =>
        prev.map((acc) => (acc.id === selectedClient.id ? { ...acc, internalNotes: finalNotes } : acc))
      );
      setNotesInput(finalNotes);
      setNotesSaved(true);
      addToast({
        title: "Notes Saved",
        description: "Internal notes updated successfully",
        color: "success",
      });
    } catch (err) {
      console.error("Failed to save internal notes:", err);
      addToast({
        title: "Error",
        description: "Failed to save internal notes",
        color: "danger",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return clientAccounts.filter((account) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        account.practiceName.toLowerCase().includes(q) ||
        account.owner.toLowerCase().includes(q) ||
        (account.email && account.email.toLowerCase().includes(q)) ||
        account.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Statuses" || account.status === statusFilter;
      const matchesPlan = planFilter === "All Plans" || account.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clientAccounts, searchQuery, statusFilter, planFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = useMemo(() => {
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, startIndex, itemsPerPage]);

  const stats: StatsSummary = useMemo(() => {
    const total = clientAccounts.length;
    const active = clientAccounts.filter((a) => a.status === "Active").length;
    const trials = clientAccounts.filter((a) => a.status === "Trial").length;
    const atRisk = clientAccounts.filter(
      (a) => a.status === "Past Due" || a.status === "Suspended"
    ).length;
    const mrr = clientAccounts.reduce((acc, curr) => acc + (curr.mrr || 0), 0);
    return { total, active, trials, atRisk, mrr };
  }, [clientAccounts]);


  return (
    <div
      className={`min-h-screen font-sans flex transition-colors duration-200 selection:bg-blue-600 selection:text-white relative ${isLight ? "bg-[#F8FAFC] text-slate-900" : "bg-[#070C18] text-slate-100"
        }`}
    >
      <SuperAdminSidebar
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
        isLight={isLight}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminHeader
          isLight={isLight}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {activeMainTab === "plans" ? (
            <PlansFeaturesTab isLight={isLight} />
          ) : activeMainTab === "phonePlans" ? (
            <PhonePlansTab isLight={isLight} />
          ) : activeMainTab === "specialties" ? (
            <SpecialtiesTab isLight={isLight} />
          ) : (
            <>
              <div>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
                    }`}
                >
                  Client Accounts
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                >
                  View, manage, and impersonate any client account.
                </p>
              </div>

              <StatsCards stats={stats} isLight={isLight} />

              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl border ${isLight
                  ? "bg-white border-slate-200/90 shadow-sm"
                  : "bg-[#0F172A]/60 border-[#1E293B]"
                  }`}
              >
                <div className="relative flex-1 w-full">
                  <FiSearch
                    className={`absolute left-3.5 top-3 text-sm ${isLight ? "text-slate-400" : "text-slate-400"
                      }`}
                  />
                  <input
                    type="text"
                    placeholder="Search practice name, owner, email, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none transition-colors ${isLight
                      ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white"
                      : "bg-[#111A2E] border border-[#1E2B45] text-slate-200 placeholder-slate-500 focus:border-blue-500"
                      }`}
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <CustomSelect
                    value={statusFilter}
                    options={[
                      "All Statuses",
                      "Active",
                      "Trial",
                      "Past Due",
                      "Onboarding",
                      "Suspended",
                      "Cancelled",
                    ]}
                    onChange={setStatusFilter}
                    isLight={isLight}
                  />

                  <CustomSelect
                    value={planFilter}
                    options={[
                      "All Plans",
                      "Growth",
                      "Scale",
                      "Starter",
                      "Enterprise",
                    ]}
                    onChange={setPlanFilter}
                    isLight={isLight}
                  />
                </div>
              </div>

              <ClientTable
                loading={loading}
                paginatedAccounts={paginatedAccounts}
                filteredAccounts={filteredAccounts}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                impersonatingId={impersonatingId}
                isLight={isLight}
                onOpenDrawer={handleOpenDrawer}
                onImpersonate={handleImpersonate}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>

      <ClientDetailsModal
        isOpen={isDrawerOpen}
        initialTab={drawerInitialTab}
        selectedClient={selectedClient}
        clientAccounts={clientAccounts}
        modalLoading={modalLoading}
        impersonatingId={impersonatingId}
        isLight={isLight}
        newTagInput={newTagInput}
        notesInput={notesInput}
        notesSaved={notesSaved}
        savingNotes={savingNotes}
        onClose={() => setIsDrawerOpen(false)}
        onImpersonate={handleImpersonate}
        onTagInputChange={setNewTagInput}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onNotesInputChange={(val) => {
          setNotesInput(val);
          setNotesSaved(false);
        }}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
};

export default AdminList;
