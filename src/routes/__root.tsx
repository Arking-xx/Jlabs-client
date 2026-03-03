import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import  { useAuth } from '../auth/AuthContext';


const RootLayout = () => {
  const {signOut, user} = useAuth() 
  const navigate = useNavigate();
  
  const logout = ()=> {
    signOut();
    navigate({to: '/login'})
  }

  return (
  <>
    <div className="p-2 flex justify-between gap-2 px-20">

      <div>
      <h2 className='text-lg font-bold'>JLabs</h2>
      </div>

    {!user && (
      <div className='flex gap-5'>
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/login" className="[&.active]:font-bold">
       Login 
      </Link>
      </div>
    )}
    {user && (
      <button className='hover:font-bold' onClick={logout}>
      Logout
      </button>
    )}

    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
  )
}
;

export const Route = createRootRoute({ component: RootLayout });
