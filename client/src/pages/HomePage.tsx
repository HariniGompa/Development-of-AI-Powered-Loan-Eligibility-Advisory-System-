import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "../hooks/useNavigate";
import {
  Menu,
  X,
  MessageSquare,
  Search,
  User,
  LogOut,
  Send,
  Share2,
  PlusCircle,
  Mic,
  Paperclip,
  Trash2,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();
  const {
    chats,
    currentChat,
    addChat,
    setCurrentChat,
    addMessage,
    deleteChat,
  } = useChat();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  const handleLogout = () => {
    logout();
    navigate("landing");
  };

  const handleNewChat = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newChat = {
      id: Math.random().toString(36).substr(2, 9),
      title: dateStr,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addChat(newChat);
    setCurrentChat(newChat);
    setMessages([]);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    if (currentChat?.id === chatId) {
      setMessages([]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setTimeout(() => {
      const aiResponse = generateAIResponse(message, user);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);

      if (currentChat) {
        addMessage(currentChat.id, userMessage);
        addMessage(currentChat.id, {
          ...userMessage,
          id: Math.random().toString(36).substr(2, 9),
          role: "assistant",
          content: aiResponse,
        });
      }
    }, 1000);

    setMessage("");
  };

  const generateAIResponse = (userMessage: string, userData: any): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("loan") && lowerMessage.includes("eligible")) {
      const creditScore = userData?.creditHistory === "excellent" ? 780 : 680;
      const income = userData?.annualSalary || 0;
      const loanAmount = userData?.loanAmount || 0;

      if (creditScore >= 750 && income >= 50000) {
        return `Based on your financial profile, you have a high probability of loan approval!\n\nKey factors:\n• Credit Score: ${creditScore} (Excellent)\n• Annual Income: $${income.toLocaleString()}\n• Requested Loan: $${loanAmount.toLocaleString()}\n• Employment: ${
          userData?.yearsOfEmployment
        } years\n\nYour debt-to-income ratio is favorable, and your credit history shows responsible financial behavior. I recommend proceeding with your loan application.`;
      } else {
        return `Based on your current financial profile, your loan approval probability is moderate.\n\nAreas that need improvement:\n${
          creditScore < 750
            ? `• Credit Score: ${creditScore} - Consider improving to 750+\n`
            : ""
        }${
          income < 50000
            ? `• Annual Income: $${income.toLocaleString()} - A higher income would strengthen your application\n`
            : ""
        }\n\nSuggestions:\n1. Pay down existing debts to improve your credit score\n2. Maintain consistent payment history for 6-12 months\n3. Consider a co-signer if available\n4. Reduce your requested loan amount if possible`;
      }
    }

    if (lowerMessage.includes("credit score")) {
      return `Your credit score is a crucial factor in loan approval. Here's what you need to know:\n\n• Excellent (750+): Best rates, highest approval chance\n• Good (700-749): Favorable rates, good approval odds\n• Fair (650-699): Higher rates, moderate approval\n• Poor (<650): Limited options, may need improvement\n\nTo improve your credit score:\n1. Pay all bills on time\n2. Keep credit utilization below 30%\n3. Don't close old credit accounts\n4. Limit new credit applications\n5. Regularly check your credit report for errors`;
    }

    if (lowerMessage.includes("emi")) {
      const loanAmount = userData?.loanAmount || 100000;
      const term = userData?.repaymentTermMonths || 60;
      const rate = 0.08;
      const monthlyRate = rate / 12;
      const emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);

      return `EMI (Equated Monthly Installment) Calculation:\n\nFor a loan of $${loanAmount.toLocaleString()} at 8% annual interest for ${term} months:\n\n• Monthly EMI: $${emi.toFixed(
        2
      )}\n• Total Payment: $${(emi * term).toFixed(2)}\n• Total Interest: $${(
        emi * term -
        loanAmount
      ).toFixed(
        2
      )}\n\nEMI = [P × R × (1+R)^N] / [(1+R)^N-1]\nWhere:\nP = Loan amount\nR = Monthly interest rate\nN = Number of months\n\nThis EMI should not exceed 40-50% of your monthly income for comfortable repayment.`;
    }

    if (
      lowerMessage.includes("document") ||
      lowerMessage.includes("requirement")
    ) {
      return `Required documents for loan application:\n\n1. Identity Proof:\n   • Government-issued ID\n   • Passport or Driver's License\n\n2. Income Proof:\n   • Last 3 months salary slips\n   • Bank statements (6 months)\n   • Income tax returns (2 years)\n\n3. Employment Proof:\n   • Employment letter\n   • Offer letter or contract\n\n4. Address Proof:\n   • Utility bills\n   • Rental agreement\n\n5. Property Documents (for home loans):\n   • Sale agreement\n   • Property title documents\n   • Valuation report\n\nEnsure all documents are up-to-date and clearly legible.`;
    }

    return `I'm here to help you with your loan application! I can assist with:\n\n• Loan eligibility assessment\n• Credit score guidance\n• EMI calculations\n• Document requirements\n• Application tips\n• Financial advice\n\nBased on your profile:\n• Annual Income: $${
      userData?.annualSalary?.toLocaleString() || "Not provided"
    }\n• Credit History: ${
      userData?.creditHistory || "Not specified"
    }\n• Employment: ${
      userData?.yearsOfEmployment || 0
    } years\n\nWhat specific information would you like to know?`;
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">LoanAdvisor AI</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Chats
          </div>
          {filteredChats.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No chats yet</p>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between hover:bg-gray-800 rounded-lg transition group"
              >
                <button
                  onClick={() => {
                    setCurrentChat(chat);
                    setMessages(
                      chat.messages.map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                      }))
                    );
                  }}
                  className="flex-1 flex items-center space-x-3 px-3 py-2 text-left"
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </button>
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={() => navigate("profile")}
            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">{user?.username || "Profile"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentChat?.title || "AI Loan Advisor"}
            </h2>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                What can I help with?
              </h3>
              <p className="text-gray-600 max-w-md">
                Ask me about loan eligibility, credit scores, EMI calculations,
                or any financial guidance you need.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl px-6 py-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 shadow-md border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <button
                type="button"
                className="p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded"
                >
                  <Mic className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
