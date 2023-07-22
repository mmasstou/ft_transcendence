import Intro from '@/components/leaderboard/Intro';
import Dashboard from '../Dashboard';

const page = () => {
  return (
    <Dashboard>
      <div
        className="text-white h-[90vh] bg-[#243230] rounded-[1rem] m-4 flex flex-col justify-start 
              md:flex-row md:justify-center">
          <Intro />
      </div>
    </Dashboard>
  );
};

export default page;
