import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className='h-screen bg-primary'>
    <div className='flex justify-center items-center h-50'>
      <h3 className='font-bold text-2xl'>JLABS ASSESSMENT</h3>
    </div>
    </div>
  );
}
