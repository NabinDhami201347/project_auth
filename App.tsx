import "react-native-gesture-handler";

import Routes from "./src/navigation";
import { AuthProvider } from "./src/context/Auth";

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
