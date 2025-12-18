import RegisterForm from "@/components/forms/RegisterForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Page: registration screen wrapper.
export default function Register() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-4 bg-sky-100">
      <h1 className="text-2xl font-semibold">Register</h1>
      <RegisterForm />
      <Button asChild variant="outline" className="w-fit">
        <Link to="/login">Back to Login</Link>
      </Button>
    </div>
  );
}
