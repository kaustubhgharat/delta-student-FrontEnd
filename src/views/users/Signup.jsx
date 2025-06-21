import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../includes/Navbar';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const URL = import.meta.env.VITE_BACKEND_URL;
    const { setIsLoggedIn } = useAuth();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            const result = await res.json();

            if (res.ok) {
                alert(result.message);
                setIsLoggedIn(true); // ✅ Now this works
                navigate('/listings');
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong");
        }
    };


    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto mt-14 px-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up on Wanderlust</h2>
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
                        <label className="block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
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
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
