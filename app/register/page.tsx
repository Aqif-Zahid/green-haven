'use client';

import { Button } from '@/components/ui/button';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [existStatus, setExistStatus] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setResult('Please enter a valid email address.');
      return;
    }

    try {
      const { doesEmailExist } = await import('./actions');
      console.log('Checking email:', email);
      const exists = await doesEmailExist(email);
      setExistStatus(exists);
      if (exists) {
        setResult('There is already an account with this email. Please log in instead');
      } else {
        setResult('There is no account with this email. Please continue with your registration');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  const handleKindeRegister = () => {
    alert('Continue registering with Kinde!'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded p-2"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
        {result && <p className="mt-4 text-red-500">{result}</p>}
        {!existStatus && (
          <RegisterLink><Button className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4'>Continue</Button></RegisterLink>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
