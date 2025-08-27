import React from 'react'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);

        //API call
    }
    return (
        <Layout>
            <div className='container d-flex justify-content-center py-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card shadow boarder-0 login'>
                        <div className='card-body p-4'>
                            <h3>Admin Login</h3>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Email</label>
                                <input
                                    {
                                        ...register('email', {
                                            required: "The email field is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })
                                    }
                                    type="text"
                                    className={`form-control ${errors.email && 'is-invalid'}`}
                                    placeholder='Email'
                                />
                                {
                                    errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                }
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Password</label>
                                <input
                                    {
                                    ...register("password", {
                                        required: "The password field is required."
                                    })
                                    }
                                    type="password"
                                    className={`form-control ${errors.password && 'is-invalid'}`}
                                    placeholder='Password'
                                />
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                }
                            </div>
                            <button className='btn btn-secondary'>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Login
