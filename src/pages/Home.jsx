import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import RotatingText from "@/components/RotatingText";

// Public landing with quick navigation.
export default function Home() {
    const { token } = useAuth();
    return (
        <div
            className="container flex min-h-screen max-w-screen flex-col items-center justify-center bg-cover bg-center p-4"
            style={{ backgroundImage: "url('/bg-image.jpg')" }}
        >
            <h1 className="text-center text-7xl font-extrabold tracking-tight text-balance text-neutral-50">
                Your{" "}
                <RotatingText
                    texts={["comfort.", "care.", "clinic."]}
                    mainClassName="inline-flex text-sky-700"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.02}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                />
            </h1>

            <h2 className="text-center text-xl mt-4 text-neutral-50">
                Welcome to Serenity Health Clinic, a patient-centred medical clinic dedicated to providing
                high-quality,
                <br />
                compassionate healthcare for individuals and families.
            </h2>

            {/* Auth actions for logged-out users */}
            {!token && (
                <div className="mt-4 flex gap-2 ">
                    <Button asChild variant="outline">
                        <Link to="/login" className="text-xl">Go to Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/register" className="text-xl bg-sky-700">Register</Link>
                    </Button>
                </div>
            )}
            
        </div>
    );
};
