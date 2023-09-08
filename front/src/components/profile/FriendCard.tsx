import { socketContext } from '@/app/Dashboard';
import { UserCardProps } from '@/types/UserCardTypes';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { FC, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiJoystick } from 'react-icons/bi';
import { TiUserAdd } from 'react-icons/ti';
import PublicProfile from '../public_profile/PublicProfile';

const SenderId = Cookies.get('_id');
const UserCard: FC<UserCardProps> = ({
  login,
  userId,
  status,
  avatar,
  socket,
  mode,
  addRequest,
  addFriendFunc,
}) => {
  const contextValue = useContext(socketContext);
  const [pending, setPending] = useState(false);
  const [invited, setInvited] = useState(false);
  const [Status, setStatus] = useState(status);

  const id = Cookies.get('_id');
  const [showPublicProfile, setPublicProfile] = useState<boolean>(false);

  let timeout: NodeJS.Timeout;
  const handleInvite = () => {
    socket.emit('sendGameNotification', {
      userId: userId,
      senderId: SenderId,
      mode: mode,
    });
    setInvited(true);
    timeout = setTimeout(() => {
      setInvited(false);
    }, 8000);
  };

  useEffect(() => {
    socket &&
      socket.on('GameResponseToChatToUser', (data: any) => {
        if (data.User.id === userId) {
          setInvited(false);
          clearTimeout(timeout);
        }
      });
    socket &&
      socket.on('UserSendToStatus', (data: any) => {
        if (data.id === userId) {
          setInvited(false);
          clearTimeout(timeout);
          setStatus(data.status);
          if (data.status === 'inGame') toast.error(data.login + ' is in Game');
          else if (data.status === 'offline')
            toast.error(data.login + ' is offline');
        }
      });
    return () => {
      socket && socket.off('GameResponseToChatToUser');
      socket && socket.off('UserSendToStatus');
    };
  }, []);

  const addFriend = async () => {
    addFriendFunc && addFriendFunc(userId);
  };

  useEffect(() => {
    if (addRequest) {
      setPending(false);
    }
  }, [contextValue]);

  const handlePublicProfile = () => {
    if (id === userId) {
      setPublicProfile(false);
    } else {
      setPublicProfile(!showPublicProfile);
    }
  };

  return (
    <>
      {showPublicProfile && (
        <PublicProfile
          userId={userId}
          handlePublicProfile={handlePublicProfile}
        />
      )}
      {showPublicProfile && (
        <div className="w-[100%] h-[100%] bg-black/60 absolute top-0 left-0 z-[800]" />
      )}

      <div className=" bg-container rounded-xl my-3 p-2 xl:p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            onClick={handlePublicProfile}
            src={avatar}
            height={50}
            width={50}
            priority
            alt={login}
            className="rounded-full border border-secondary cursor-pointer"
          />
          <h3 className="xl:text-lg">{login}</h3>
        </div>
        <div className="flex items-center text-xs xl:text-sm gap-2">
          {addRequest ? (
            <button
              onClick={() => addFriend().then(() => setPending(true))}
              className="flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 hover:bg-sky-600 hover:text-container hover:border-container group transition-colors"
            >
              {!pending && (
                <TiUserAdd
                  className="mr-1 fill-sky-500 group-hover:fill-container"
                  size={16}
                />
              )}
              {pending ? 'Pending...' : 'Add Friend'}
            </button>
          ) : (
            Status === 'online' &&
            socket !== undefined && (
              <button
                disabled={invited}
                onClick={handleInvite}
                className={`flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 enabled:hover:bg-sky-600 enabled:hover:text-container enabled:hover:border-container group transition-colors
              ${invited && 'opacity-50 cursor-not-allowed '}
              `}
              >
                {addRequest ? (
                  <TiUserAdd
                    className="mr-1 fill-sky-500 group-hover:fill-container"
                    size={16}
                  />
                ) : (
                  Status === 'online' && (
                    <BiJoystick
                      className="mr-1 fill-sky-500 group-enabled:group-hover:fill-container"
                      size={16}
                    />
                  )
                )}
                Invite
              </button>
            )
          )}
          {!addRequest && (
            <div
              className={`border flex gap-1 items-center p-1 px-2 xl:px-3 rounded-xl ${
                Status === 'inGame'
                  ? 'border-orange-500'
                  : Status === 'online'
                  ? 'border-green-500'
                  : 'border-yellow-500'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  Status === 'inGame'
                    ? 'bg-orange-500'
                    : Status === 'online'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
              ></div>
              <span
                className={`
            ${
              Status === 'inGame'
                ? 'text-orange-500'
                : Status === 'online'
                ? 'text-green-500'
                : 'text-yellow-500'
            }
          `}
              >
                {Status === 'inGame'
                  ? 'In Game'
                  : Status === 'online'
                  ? 'Online'
                  : 'Offline'}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
