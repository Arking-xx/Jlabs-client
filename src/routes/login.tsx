import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', data);
      console.log(response.data);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      console.error(err?.response?.data.message || 'Login failed');
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
            <input
              type="text"
              {...register('email')}
              className="border h-9 rounded-sm px-1 text-gray-400"
              placeholder="email@gmail.com"
            />
            <label htmlFor="password" className="">
              Password:
            </label>
            <input
              type="password"
              {...register('password')}
              className="border h-10 rounded-sm px-1 text-gray-400"
              placeholder="Enter your password"
            />
            <button type="submit" className="border h-10 bg-amber-950 text-white my-2 rounded-sm">
              Login
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?&nbsp;
            <a className="text-blue-600 hover:text-blue-800 font-medium hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
