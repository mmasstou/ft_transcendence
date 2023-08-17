import Settings from '@/components/Dashboard/Header/Settings';
import { Toaster } from 'react-hot-toast';

const page = () => {
  return (
    <>
      <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
        <div
          className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
        >
          <Settings />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default page;
