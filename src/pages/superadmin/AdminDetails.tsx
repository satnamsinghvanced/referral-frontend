import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";

const AdminDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAdminDetails();
  }, [id]);
  const fetchAdminDetails = async () => {
    try {
      const res = await api.get(`/superadmin/admins/${id}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin details", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="p-8">Loading details...</div>;
  }
  if (!data || !data.admin) {
    return <div className="p-8 text-red-500">Admin not found.</div>;
  }
  const { admin, plan, teamMembers } = data;
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Admin Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Profile Information</h2>
          <div className="space-y-3">
            <p><span className="text-gray-500 w-32 inline-block">Name:</span> <span className="font-medium">{admin.firstName} {admin.lastName}</span></p>
            <p><span className="text-gray-500 w-32 inline-block">Email:</span> <span>{admin.email}</span></p>
            <p><span className="text-gray-500 w-32 inline-block">Phone:</span> <span>{admin.phone || "N/A"}</span></p>
            <p><span className="text-gray-500 w-32 inline-block">Practice:</span> <span>{admin.practiceName || "N/A"}</span></p>
            <p><span className="text-gray-500 w-32 inline-block">Specialty:</span> <span>{admin.medicalSpecialty?.name || "N/A"}</span></p>
            <p><span className="text-gray-500 w-32 inline-block">Status:</span> 
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {admin.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Subscription Plan</h2>
          {plan ? (
            <div className="space-y-3">
              <p><span className="text-gray-500 w-32 inline-block">Plan Name:</span> <span className="font-semibold text-primary">{plan.name}</span></p>
              <p><span className="text-gray-500 w-32 inline-block">Price:</span> <span>${plan.price} / {plan.billingCycle}</span></p>
              <p><span className="text-gray-500 w-32 inline-block">Status:</span> <span>{plan.status}</span></p>
              <p><span className="text-gray-500 w-32 inline-block">Next Billing:</span> <span>{plan.nextBillingDate ? new Date(plan.nextBillingDate).toLocaleDateString() : "N/A"}</span></p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No active subscription plan found for this admin.</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Team Members ({teamMembers?.length || 0})</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member: any) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.role?.role || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  This admin has no team members.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDetails;
