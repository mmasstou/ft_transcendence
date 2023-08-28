import * as Avatar from '@radix-ui/react-avatar';
import style from '@/components/Home/style';

interface ImageProps {
  image: string | undefined;
}

const AvatarUpload: React.FC<ImageProps> = ({ image }): JSX.Element => {
  return (
    <Avatar.Root
      className={`${style.flexCenter} flex-inline align-middle overflow-hidden select-none rounded-full
                    w-[60px] h-[60px] `}
    >
      <Avatar.Image
        className="w-[100%] h-[100%] object-cover rounded-[inherit] border-secondary"
        src={image}
        alt="User Avatar"
      />
      <Avatar.Fallback
        className={`w-[100%] h-[100%] ${style.flexCenter} bg-white text-[15px] leanding-1 font-medium`}
        delayMs={600}
      >
        Avatar
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export default AvatarUpload;
