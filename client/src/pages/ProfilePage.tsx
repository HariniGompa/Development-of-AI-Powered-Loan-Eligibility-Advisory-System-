import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "../hooks/useNavigate";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import type { UserProfile } from "../types/user"; // ✅ Adjust this import path if needed

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Properly type formData with UserProfile
  const [formData, setFormData] = useState<UserProfile>(
    user || {
      id: "",
      email: "",
      username: "",
      gender: "",
      age: 0,
      education: "",
      maritalStatus: "",
      dependents: 0,
      nationality: "",
      jobType: "",
      yearsOfEmployment: 0,
      annualSalary: 0,
      collateralValue: 0,
      employmentType: "private",
      previousLoans: false,
      previousLoansStatus: "",
      previousLoanAmount: 0,
      totalEmiAmount: 0,
      savingBankBalance: 0,
      loanPurpose: "",
      loanAmount: 0,
      repaymentTermMonths: 0,
      creditHistory: "",
      rentIncome: 0,
      interestIncome: 0,
      numberOfCreditCards: 0,
      averageCreditUtilization: 0,
      latePaymentHistory: false,
      loanInsurance: false,
    }
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user || formData);
    setIsEditing(false);
  };

  const InfoSection = ({
    title,
    fields,
  }: {
    title: string;
    fields: Array<{
      label: string;
      name: keyof UserProfile;
      type?: string;
      options?: Array<{ value: string; label: string }>;
    }>;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b">
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={String(field.name)}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            {isEditing ? (
              field.options ? (
                <select
                  name={field.name as string}
                  value={String(formData[field.name] ?? "")}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={field.name as string}
                  checked={Boolean(formData[field.name])}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name as string}
                  value={String(formData[field.name] ?? "")}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )
            ) : (
              <p className="text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                {field.type === "checkbox"
                  ? formData[field.name]
                    ? "Yes"
                    : "No"
                  : String(formData[field.name] ?? "N/A")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("home")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Chat</span>
          </button>

          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {formData.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formData.username}
              </h1>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <InfoSection
          title="Personal Information"
          fields={[
            { label: "Username", name: "username" },
            { label: "Email", name: "email", type: "email" },
            {
              label: "Gender",
              name: "gender",
              options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ],
            },
            { label: "Age", name: "age", type: "number" },
            {
              label: "Education",
              name: "education",
              options: [
                { value: "high_school", label: "High School" },
                { value: "bachelors", label: "Bachelor's Degree" },
                { value: "masters", label: "Master's Degree" },
                { value: "phd", label: "PhD" },
              ],
            },
            {
              label: "Marital Status",
              name: "maritalStatus",
              options: [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
              ],
            },
            { label: "Dependents", name: "dependents", type: "number" },
            { label: "Nationality", name: "nationality" },
          ]}
        />

        {/* Employment Details */}
        <InfoSection
          title="Employment Details"
          fields={[
            { label: "Job Type", name: "jobType" },
            {
              label: "Years of Employment",
              name: "yearsOfEmployment",
              type: "number",
            },
            { label: "Annual Salary", name: "annualSalary", type: "number" },
            {
              label: "Collateral Value",
              name: "collateralValue",
              type: "number",
            },
            {
              label: "Employment Type",
              name: "employmentType",
              options: [
                { value: "government", label: "Government" },
                { value: "private", label: "Private" },
                { value: "startup", label: "Startup" },
                { value: "contract_based", label: "Contract Based" },
                { value: "unemployed", label: "Unemployed" },
              ],
            },
          ]}
        />

        {/* Financial History */}
        <InfoSection
          title="Financial History"
          fields={[
            {
              label: "Previous Loans",
              name: "previousLoans",
              type: "checkbox",
            },
            { label: "Previous Loan Status", name: "previousLoansStatus" },
            {
              label: "Previous Loan Amount",
              name: "previousLoanAmount",
              type: "number",
            },
            {
              label: "Total EMI Amount",
              name: "totalEmiAmount",
              type: "number",
            },
            {
              label: "Savings Bank Balance",
              name: "savingBankBalance",
              type: "number",
            },
          ]}
        />

        {/* Loan Requirements */}
        <InfoSection
          title="Loan Requirements"
          fields={[
            { label: "Loan Purpose", name: "loanPurpose" },
            { label: "Loan Amount", name: "loanAmount", type: "number" },
            {
              label: "Repayment Term (Months)",
              name: "repaymentTermMonths",
              type: "number",
            },
            { label: "Credit History", name: "creditHistory" },
          ]}
        />

        {/* Additional Income & Credit */}
        <InfoSection
          title="Additional Income & Credit"
          fields={[
            { label: "Rent Income", name: "rentIncome", type: "number" },
            {
              label: "Interest Income",
              name: "interestIncome",
              type: "number",
            },
            {
              label: "Number of Credit Cards",
              name: "numberOfCreditCards",
              type: "number",
            },
            {
              label: "Average Credit Utilization (%)",
              name: "averageCreditUtilization",
              type: "number",
            },
            {
              label: "Late Payment History",
              name: "latePaymentHistory",
              type: "checkbox",
            },
            {
              label: "Loan Insurance",
              name: "loanInsurance",
              type: "checkbox",
            },
          ]}
        />
      </div>
    </div>
  );
}
