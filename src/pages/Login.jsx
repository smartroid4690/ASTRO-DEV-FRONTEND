import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate , Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../services/quotationService';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('/auth/login/', data);
            const refreshToken = response.data["refresh"];
            const accessToken = response.data["access"];

            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('access_token', accessToken);
            navigate("/");
            toast.success("User successfully logged in");
        } catch (error) {
            console.error("Login failed", error);
            toast.error("Login failed")
        }
    };

    return (
        <div className="flex align-items-center justify-content-center mt-8 w-8 mb-8">
            <div className="surface-card p-4 shadow-2 border-round lg:w-6 w-full">
                <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                    <Link to='/signUp' className='font-medium no-underline ml-2 text-blue-500 cursor-pointer'>Create today!</Link>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {/* Email Input Field */}
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <InputText
                            {...register('email', { required: "Email is required" })}
                            id="email"
                            type="text"
                            placeholder="Email address"
                            className={`w-full mb-3 ${errors.email ? 'p-invalid' : ''}`}
                        />
                        {errors.email && <small className="p-error">{errors.email.message}</small>}

                        {/* Password Input Field */}
                        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                        <InputText
                            {...register('password', { required: "Password is required" })}
                            id="password"
                            type="password"
                            placeholder="Password"
                            className={`w-full mb-3 ${errors.password ? 'p-invalid' : ''}`}
                        />
                        {errors.password && <small className="p-error">{errors.password.message}</small>}

                        {/* Submit Button */}
                        <div className="text-center mt-4">
                            <Button type="submit" label="Log In" icon="pi pi-user" className="w-auto" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
