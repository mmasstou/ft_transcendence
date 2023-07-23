import CardRank from "./CardRank";

const RankBoard = () => {
  return (
    <div className="flex flex-col mt-10 md:mx-4">
      <div className="flex flex-row justify-between items-center mx-6 md:mx-9 gap-10">
        <div className="flex flex-row justify-between gap-4 ">
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Rank
          </h1>
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Player
          </h1>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Wins
          </h1>
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Loses
          </h1>
        </div>
      </div>

      <CardRank />
      <CardRank />
      <CardRank />
      <CardRank />
    </div>
  );
};

export default RankBoard;
