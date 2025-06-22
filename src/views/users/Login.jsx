import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../includes/Navbar';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Login() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const URL = import.meta.env.VITE_BACKEND_URL;
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMsg = params.get('error');
        if (errorMsg) {
            setServerError(errorMsg);
        }
    }, [location]);
    
    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include' // ✅ keep this
            });

            // ✅ Log here safely
            console.log("Response headers:", [...res.headers.entries()]);
            console.log("Document cookies:", document.cookie);

            if (res.ok) {
                const result = await res.json();
                alert(result.message || "Login successful!");
                setServerError("");
                reset(); // Clear form
                const redirectPath = localStorage.getItem('redirectAfterLogin') || '/listings';
                navigate(redirectPath);
                localStorage.removeItem('redirectAfterLogin');
            } else {
                const result = await res.json();
                setServerError(result.error || "Login failed");
                console.log(result);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto mt-14 px-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Login on Wanderlust</h2>
                {serverError && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                        {serverError}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl p-6 space-y-4" noValidate>
                    <div>
                        <label className="block font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
                    </div>



                    <div>
                        <label className="block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
