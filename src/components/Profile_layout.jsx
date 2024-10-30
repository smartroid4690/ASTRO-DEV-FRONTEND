import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../services/quotationService';

export const Profile_layout = () => {
    const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm();
    const [requestorId, setRequestorId] = useState(null);
    const [initialOrgEmail, setInitialOrgEmail] = useState(null);
    const [isOrgDisabled, setIsOrgDisabled] = useState(false);
    const [requiredOrg, SetrequireOrg] = useState(false);
    const [hasAccessToken, setHasAccessToken] = useState(!!localStorage.getItem('access_token')); // Convert value to boolen using !!
    const [error, setError] = useState(null);

    const organizationFields = watch(['organization.name', 'organization.email', 'organization.address', 'organization.established_date']);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken) {
                    const response = await axiosInstance.get('/r/Requestor/', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    console.log('API call successful, Response:', response.data);

                    const orgData = response.data[0].organization;

                    if (orgData) {
                        setValue('organization.name', orgData.name);
                        setValue('organization.email', orgData.email);
                        setValue('organization.address', orgData.address);
                        setValue('organization.established_date', orgData.established_date);
                        setInitialOrgEmail(orgData.email);
                    } else {
                        setIsOrgDisabled(true);  // Disable organization fields if null
                    }

                    setValue('first_name', response.data[0].first_name);
                    setValue('last_name', response.data[0].last_name);
                    setValue('email', response.data[0].email);

                    setRequestorId(response.data[0].id);
                } else {
                    setHasAccessToken(false);
                    setError("Please log in...");
                    toast.error("Please log in...")
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data');
            }
        };

        fetchData();
    }, [setValue]);

    useEffect(() => {
        // Set `isOrgDisabled` to false if any organization field has a value
        const anyOrgFieldHasValue = organizationFields.some(field => field);
        if (anyOrgFieldHasValue) {
            setIsOrgDisabled(false);
            SetrequireOrg(true);
        }
    }, [organizationFields]);

    const onSubmit = async (data) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const payload = { ...data };

            if (isOrgDisabled) {
                payload.organization = null;
            } else {
                const currentOrgEmail = getValues('organization.email');
                if (currentOrgEmail !== initialOrgEmail) {
                    payload.organization = { ...payload.organization, email: currentOrgEmail };
                } else {
                    delete payload.organization.email;
                }
            }

            const response = await axiosInstance.put(`/r/Requestor/${requestorId}/`, payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log('Form Data:', payload);
            toast.success('Profile updated successfully');
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    };

    return (
        <div className="flex align-items-center justify-content-center w-8 mt-8">
            {hasAccessToken ? (
                <div className="surface-card p-4 pt-8 shadow-2 border-round lg:w-6 w-full mt-8">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <h2 className="text-2xl font-bold text-center">Organization Information</h2>
                        <div>
                            <label htmlFor="organization.name" className="block text-900 font-medium mb-2">Organization Name</label>
                            <InputText
                                id="organization.name"
                                {...register('organization.name', {
                                    required: requiredOrg ? 'Organization Name is required' : false
                                })}
                                placeholder="Enter Organization Name"
                                className={`w-full mb-3 ${errors.organization?.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.organization?.name && <span className="text-red-500 text-sm">{errors.organization.name.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="organization.email" className="block text-900 font-medium mb-2">Organization Email</label>
                            <InputText
                                id="organization.email"
                                type="email"
                                {...register('organization.email', {
                                    required: requiredOrg ? 'Organization Email is required' : false
                                })}
                                placeholder="Enter Organization Email"
                                className={`w-full mb-3 ${errors.organization?.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.organization?.email && <span className="text-red-500 text-sm">{errors.organization.email.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="organization.address" className="block text-900 font-medium mb-2">Organization Address</label>
                            <InputText
                                id="organization.address"
                                {...register('organization.address', {
                                    required: requiredOrg ? 'Organization Address is required' : false
                                })}
                                placeholder="Enter Organization Address"
                                className={`w-full mb-3 ${errors.organization?.address ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.organization?.address && <span className="text-red-500 text-sm">{errors.organization.address.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="organization.established_date" className="block text-900 font-medium mb-2">Established Date</label>
                            <InputText
                                id="organization.established_date"
                                type="date"
                                {...register('organization.established_date', {
                                    required: requiredOrg ? 'Established Date is required' : false
                                })}
                                className={`w-full mb-3 ${errors.organization?.established_date ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.organization?.established_date && <span className="text-red-500 text-sm">{errors.organization.established_date.message}</span>}
                        </div>

                        {/* First Name */}
                        <h2 className="text-2xl font-bold text-center">User Information</h2>
                        <div>
                            <label htmlFor="first_name" className="block text-900 font-medium mb-2">First Name</label>
                            <InputText
                                id="first_name"
                                {...register('first_name', { required: 'First Name is required' })}
                                placeholder="Enter First Name"
                                className={`w-full mb-3 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
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
                                className={`w-full mb-3 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name.message}</span>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                placeholder="Enter Email"
                                className={`w-full mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        {/* Submit Button */}
                        <div className="text-center mt-4">
                            <Button type="submit" label="Update Profile" icon="pi pi-save" className="w-auto" />
                        </div>

                    </form>
                </div>
            ) : (
                <div className="text-red-600 text-center text-5xl">{error}</div>
            )}
        </div>
    );
};
