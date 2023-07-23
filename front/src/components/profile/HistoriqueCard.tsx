import MyAvatar from './MyAvatar';


const HistoriqueCard = () => {
  return (
    <div className="bg-[#3E504D]  w-full h-[47px] lg:h-[85px] flex justify-between mx-2 my-2 rounded-md 2xl:h-[95px]">
      <div className="flex flex-col overflow-hidden items-center justify-center lg:mx-8">
        <div className="w-[28px] h-[28px] lg:h-[45px] lg:w-[45px] xl:h-[60px] xl:w-[60px] mx-2">
          <MyAvatar />
        </div>
        <span className="text-[0.625em] lg:text-[1em] font-semibold text-white mx-2 lg:mx-4">
          azouhadou
        </span>
      </div>

      <div className="flex items-center cursor-default">
        <div
          className={`bg-transparent text-secondary flex justify-center items-center gap-2 border rounded-full border-secondary 
                            text-[1em] md:text-[1em] lg:text-[1.5em] xl:text-[1.5em] 2xl:text-[1.5em]
                            px-2 md:px-10 md:py-2 lg:px-10 lg:py-2 xl:px-10 xl:py-2 2xl:px-10 2xl:py-2
                `}
        >
          <span className="font-semibold">7</span>{' '}
          <span className="font-semibold">VS</span>{' '}
          <span className="font-semibold">4</span>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden items-center justify-center lg:mx-8">
        <div className="w-[28px] h-[28px] lg:h-[45px] lg:w-[45px] xl:h-[60px] xl:w-[60px] mx-2">
          <MyAvatar />
        </div>
        <span className="text-[0.625em] lg:text-[1em] font-semibold text-white mx-2 lg:mx-4">
          azouhadou
        </span>
      </div>
    </div>
  );
};

export default HistoriqueCard;
