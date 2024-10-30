import React from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/quotationService';


const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/register/', data);
      console.log('Form submitted successfully:', response.data);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error(error.response.data.email);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center mt-8 mb-8 w-8">
      <div className="surface-card p-4 shadow-2 border-round lg:w-6 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-900 font-medium mb-2">First Name</label>
            <InputText
              id="first_name"
              {...register('first_name', { required: 'First Name is required' })}
              placeholder="Enter First Name"
              className={`w-full mb-3 ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name.message}</span>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-900 font-medium mb-2">Last Name</label>
            <InputText
              id="last_name"
              {...register('last_name', { required: 'Last Name is required' })}
              placeholder="Enter Last Name"
              className={`w-full mb-3 ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
            <InputText
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  message: 'Invalid email address',
                },
              })}
              placeholder="Enter Email"
              className={`w-full mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
            <InputText
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              })}
              placeholder="Enter Password"
              className={`w-full mb-3 ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <Button type="submit" label="Registration" icon="pi pi-user" className="w-auto" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignUp;
