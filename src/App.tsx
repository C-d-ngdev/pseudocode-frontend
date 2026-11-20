import AuthCard3D from "./Auth/Auth";

export default function App() {
  return (
    <AuthCard3D
      onLogin={(data) => console.log("login", data)}
      onRegister={(data) => console.log("register", data)}
    />
  );
}



