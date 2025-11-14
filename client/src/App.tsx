import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import Router from "./Router";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
