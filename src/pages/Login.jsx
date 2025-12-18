import LoginForm from "@/components/forms/LoginForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Page: login screen wrapper.
export default function Login() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-4 bg-sky-100">
      <h1 className="text-2xl font-semibold">Login</h1>
      <LoginForm />
      <Button asChild variant="outline" className="w-fit">
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
}
