import Intro from '@/components/leaderboard/Intro';
import RankBoard from '../../components/leaderboard/RankBoard';
import Dashboard from '../Dashboard';

const page = () => {
  return (
    <Dashboard>
      <div className="flex flex-col text-white h-[90vh] bg-[#243230] rounded-[1rem] m-4 overflow-y-scroll">
        <Intro />
        <RankBoard />
      </div>
    </Dashboard>
  );
};

export default page;
