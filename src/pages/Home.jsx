import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Page: public landing with quick navigation and auth CTAs.
export default function Home() {
    const { token } = useAuth();
    return (
        <>
            <h1>This is Home</h1>

            {/* Public navigation shortcuts */}
            <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline">
                    <Link to="/doctors">Doctors</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link to="/patients">Patients</Link>
                </Button>
                {token && (
                    <Button asChild>
                        <Link to="/appointments">Make an Appointment</Link>
                    </Button>
                )}
            </div>

            {/* Auth actions for logged-out users */}
            {!token && (
                <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline">
                        <Link to="/login">Go to Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/register">Register</Link>
                    </Button>
                </div>
            )}
            
        </>
    );
};
