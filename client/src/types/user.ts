export interface UserProfile {
  id: string;
  email: string;
  username: string;
  gender: string;
  age: number;
  education: string;
  maritalStatus: string;
  dependents: number;
  nationality: string;
  jobType: string;
  yearsOfEmployment: number;
  annualSalary: number;
  collateralValue: number;

  // ✅ Expanded employmentType to match SignupPage values
  employmentType:
    | "government"
    | "private"
    | "startup"
    | "contract_based"
    | "unemployed";

  previousLoans: boolean;
  previousLoansStatus?: string;
  previousLoanAmount?: number;
  totalEmiAmount?: number;
  savingBankBalance: number;
  loanPurpose: string;
  loanAmount: number;
  repaymentTermMonths: number;
  creditHistory: string;
  rentIncome: number;
  interestIncome: number;
  numberOfCreditCards: number;
  averageCreditUtilization: number;
  latePaymentHistory: boolean;
  loanInsurance: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
