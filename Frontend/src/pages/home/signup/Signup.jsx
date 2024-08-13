import React, { useState } from 'react'
import Gendercheckbox from './Gendercheckbox'
import { Link } from 'react-router-dom'
import useSignup from '../../../hooks/useSignup.js'

const Signup = () => {
    const [input, setInputs] = useState({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: ''
    })

    const {loading, signup} = useSignup()
    
    const handleCheckBox = (gender) => {
        setInputs({ ...input, gender })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(input)
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    SignUp
                    <span className='text-blue-500'>ChatApp</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='tet-base label-text'>Fullname</span>
                        </label>
                        <input type='text' placeholder='Enter Fullname' value={input.fullname} onChange={(e) => setInputs({ ...input, fullname: e.target.value })} className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label p-2'>
                            <span className='tet-base label-text'>Username</span>
                        </label>
                        <input type='text' placeholder='Enter Username' value={input.username} onChange={(e) => setInputs({ ...input, username: e.target.value })} className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label'>
                            <span className='tet-base label-text'>Password</span>
                        </label>
                        <input type='password' placeholder='Enter Password' value={input.password} onChange={(e) => setInputs({ ...input, password: e.target.value })} className='w-full input input-bordered h-10' />
                    </div>
                    <div>
                        <label className='label'>
                            <span className='tet-base label-text'>Confirm Password</span>
                        </label>
                        <input type='password' placeholder='Confirm Password' value={input.confirmPassword} onChange={(e) => setInputs({ ...input, confirmPassword: e.target.value })} className='w-full input input-bordered h-10' />
                    </div>

                    <Gendercheckbox onCheckBox={handleCheckBox} selectedGender={input.gender} />

                    <Link to='/login' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                        Already have an account?
                    </Link>

                    <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						</button>
                </form>
            </div>
        </div>
    )
}

export default Signup
