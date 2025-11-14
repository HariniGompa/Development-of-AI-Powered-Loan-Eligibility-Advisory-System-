import { useState } from "react";
import { useNavigate } from "../hooks/useNavigate";
import { useAuth } from "../context/AuthContext";
import { Brain, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      id: "demo-user-id",
      email: formData.email,
      username: "Demo User",
      gender: "male",
      age: 30,
      education: "bachelors",
      maritalStatus: "single",
      dependents: 0,
      nationality: "US",
      jobType: "Software Engineer",
      yearsOfEmployment: 5,
      annualSalary: 75000,
      collateralValue: 100000,
      employmentType: "private" as const,
      previousLoans: false,
      savingBankBalance: 20000,
      loanPurpose: "home",
      loanAmount: 300000,
      repaymentTermMonths: 360,
      creditHistory: "excellent",
      rentIncome: 0,
      interestIncome: 1000,
      numberOfCreditCards: 2,
      averageCreditUtilization: 30,
      latePaymentHistory: false,
      loanInsurance: true,
    };
    login(mockUser);
    navigate("home");
  };
  /*
  const handleGoogleLogin = () => {
    alert("Google Login integration would be implemented here");
  };
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate("landing")}
            className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-10 h-10 text-blue-600 mr-3" />
            <span className="text-3xl font-bold text-gray-900">
              LoanAdvisor AI
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
            >
              Sign In
            </button>
            {/*
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button>
            */}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("signup")}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
