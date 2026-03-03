import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';
// import { useForm } from 'react-hook-form';

type LoginForm = {
  email: string;
  password: string;
};


export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("")

  const {signIn} = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: {email: string, password: string}) => {
    try {
      await signIn(data.email, data.password )
      navigate({ to: '/home' });
    } catch (err: any) {
      console.error(err?.response?.data.message || 'Login failed');
      setAuthError(err?.response?.data.message || "Invalid email or password")
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-sm border border-gray-400 w-100 py-15 px-4 bg-white"
        >
          <h2 className="text-center text-2xl">Sign In</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="">
              Email:
            </label>
              {errors.email && (
                <span className='text-xs text-red-500'>{errors.email.message}</span>
              )}
            <input
              type="text"
              {...register('email', {required: "Email is required"})}
              className="border h-9 rounded-sm px-1 text-gray-400"
              placeholder="email@gmail.com"
            />
              
            <label htmlFor="password" className="">
              Password:
            </label>
              {errors.password && (
                <span className='text-xs text-red-500'>{errors.password.message}</span>
              )}
            <input

              type="password"
              {...register('password', {required: "Password is required"})}
              className="border h-10 rounded-sm px-1 text-gray-400"
              placeholder="Enter your password"
            />
            {authError && (
              <span className='text-xs text-red-500 text-center'>{authError}</span>
            )
            }
            <button type="submit" className="border h-10 bg-amber-950 text-white my-2 rounded-sm">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
