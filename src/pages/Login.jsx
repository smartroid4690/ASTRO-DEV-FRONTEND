import axios from 'axios'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [checked, setChecked] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm('')
    const navigated = useNavigate()
    const redirected = async (data) => {
        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data)
            navigated("/")
        } catch (error) {

        }
    }
    return (
        <>
            <div className="flex align-items-center justify-content-center mt-8">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                    <div className="text-center mb-5">
                        <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                        <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
                    </div>
                    <form onSubmit={handleSubmit(redirected)}>
                        <div>
                            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                            <InputText
                                {...register('email', { required: true })} id="email" type="text" placeholder="Email address" className="w-full mb-3" />

                            <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                            <InputText {...register('password', { required: true })} id="password" type="password" placeholder="Password" className="w-full mb-3" />

                            <div className="flex align-items-center justify-content-between mb-6">
                                <div className="flex align-items-center ">
                                    {/* <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                                <label htmlFor="rememberme">Remember me</label> */}
                                    <span className='font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer'>
                                        Explore as a Guest

                                    </span>
                                </div>
                                <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                            </div>

                            <Button type='submit' label="Sign In" icon="pi pi-user" className="w-full" />
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Login