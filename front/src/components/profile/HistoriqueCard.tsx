import MyAvatar from './MyAvatar';

const HistoriqueCard = () => {
  return (
    <div className="bg-[#3E504D]  w-full flex justify-between items-center py-2 px-3 lg:py-3 lg:px-4 rounded-md">
      <div className="flex flex-col overflow-hidden items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 xl:h-16 xl:w-16">
          <MyAvatar />
        </div>
        <span className="text-sm xl:text-lg font-semibold text-white">
          azouhadou
        </span>
      </div>

      <div className="flex items-center cursor-default text-sm xl:text-xl tracking-widest">
        <div
          className={`p-2 lg:p-3 bg-transparent text-secondary flex justify-center gap-1 xl:gap-2 items-center border rounded-2xl border-secondary 
                `}
        >
          <span className="font-semibold">7</span>{' '}
          <span className="font-semibold">vs</span>{' '}
          <span className="font-semibold">4</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 xl:h-16 xl:w-16">
          <MyAvatar />
        </div>
        <span className="text-sm xl:text-lg font-semibold text-white">
          azouhadou
        </span>
      </div>
    </div>
  );
};

export default HistoriqueCard;
