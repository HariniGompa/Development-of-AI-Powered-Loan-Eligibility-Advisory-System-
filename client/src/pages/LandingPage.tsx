import { useNavigate } from "../hooks/useNavigate";
import {
  Brain,
  Shield,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                LoanAdvisor AI
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("login")}
                className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("signup")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Loan Eligibility Advisor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get instant, transparent loan approval predictions powered by
            machine learning. Understand your credit factors and receive
            personalized financial guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Instant Predictions
            </h3>
            <p className="text-gray-600">
              Receive real-time loan approval probability based on your
              financial profile using advanced machine learning models.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI Chatbot Assistant
            </h3>
            <p className="text-gray-600">
              Get personalized guidance explaining credit scores, EMI
              calculations, and approval factors through our intelligent
              chatbot.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Explainable Results
            </h3>
            <p className="text-gray-600">
              Understand how each factor impacts your application with
              transparent AI visualizations and detailed explanations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              PDF Reports
            </h3>
            <p className="text-gray-600">
              Download professional credit evaluation reports with comprehensive
              analysis and visual insights.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your financial data is encrypted and protected with
              industry-standard security measures.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              24/7 Availability
            </h3>
            <p className="text-gray-600">
              Access loan evaluation and financial guidance anytime, anywhere
              with our always-on platform.
            </p>
          </div>
        </div>
        {/*  
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users making informed financial decisions with AI
            assistance.
          </p>
          <button
            onClick={() => navigate("signup")}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Create Your Free Account
          </button>
        </div>
        */}
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 LoanAdvisor AI. Empowering financial decisions through
            artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
