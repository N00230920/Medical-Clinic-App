import LoginForm from "@/components/LoginForm";

export default function Home({loggedIn, onLogin}) {
    return (
        <>
            <h1>This is Home</h1>
            <LoginForm onLogin={onLogin} loggedIn={loggedIn} />
        </>
    );
};