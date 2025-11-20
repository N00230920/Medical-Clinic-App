import LoginForm from "@/components/LoginForm";

export default function Home({loggedIn, onLogin}) {
    const {token} = useAuth();
    return (
        <>
            <h1>This is Home</h1>
            
            {!token && <LoginForm />}
            
        </>
    );
};