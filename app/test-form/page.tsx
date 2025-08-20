'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TestFormPage() {
  const [testValue, setTestValue] = useState('');
  const { register, handleSubmit, watch } = useForm();
  
  // Watch form values to see what's happening
  const watchedValues = watch();

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    alert(`Form data: ${JSON.stringify(data)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Form Test</h1>
        
        {/* Test 1: Basic HTML input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test 1: Basic HTML Input
          </label>
          <input
            type="text"
            placeholder="Type here..."
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            style={{ color: 'black', backgroundColor: 'white' }}
          />
          <p className="text-sm text-gray-600 mt-1">Value: {testValue}</p>
        </div>

        {/* Test 2: React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test 2: React Hook Form
            </label>
            <input
              type="text"
              placeholder="Type here..."
              {...register('testField')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              style={{ color: 'black !important', backgroundColor: 'white !important' }}
            />
            <p className="text-sm text-gray-600 mt-1">
              Value: {watchedValues?.testField || 'empty'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test 3: Email Input
            </label>
            <input
              type="email"
              placeholder="Enter email..."
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              style={{ color: 'black !important', backgroundColor: 'white !important' }}
            />
            <p className="text-sm text-gray-600 mt-1">
              Email: {watchedValues?.email || 'empty'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test 4: Password Input
            </label>
            <input
              type="password"
              placeholder="Enter password..."
              {...register('password')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              style={{ color: 'black !important', backgroundColor: 'white !important' }}
            />
            <p className="text-sm text-gray-600 mt-1">
              Password: {watchedValues?.password ? '***' : 'empty'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Test Form
          </button>
        </form>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(watchedValues, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 