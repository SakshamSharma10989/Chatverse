import React, { useState } from 'react';
import Gendercheckbox from './Gendercheckbox';
import { Link } from 'react-router-dom';
import useSignup from '../../../hooks/useSignup.js';

const Signup = () => {
  const [input, setInputs] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const { loading, signup } = useSignup();

  const handleCheckBox = (gender) => {
    setInputs({ ...input, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(input);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto min-h-screen">
      <div className="w-full p-6 rounded-lg shadow-md bg-[#1a1f2b] bg-opacity-80 border border-gray-600 max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-300 mb-4">
          Create your <span className="text-blue-500">ChatApp</span> account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {[
            { placeholder: 'Full Name', name: 'fullname', type: 'text' },
            { placeholder: 'Username', name: 'username', type: 'text' },
            { placeholder: 'Password', name: 'password', type: 'password' },
            { placeholder: 'Confirm Password', name: 'confirmPassword', type: 'password' }
          ].map(({ placeholder, name, type }) => (
            <input
              key={name}
              type={type}
              placeholder={placeholder}
              value={input[name]}
              onChange={(e) => setInputs({ ...input, [name]: e.target.value })}
              className="w-full input input-bordered h-10 text-gray-300 bg-[#1e293b] placeholder-gray-400"
            />
          ))}

          <Gendercheckbox onCheckBox={handleCheckBox} selectedGender={input.gender} />

          <div className="text-gray-400 text-sm mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 rounded-lg bg-[#111827] hover:bg-[#0f172a] text-gray-200 font-medium transition"
          >
            {loading ? <span className="loading loading-spinner" /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
