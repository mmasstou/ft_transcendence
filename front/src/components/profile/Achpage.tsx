import axios from 'axios';
import Achievement from './Achievement';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface UserAchievements {
  TotalMatch?: number;
  cleanSheet?: boolean;
  Level?: number;
  Machine?: boolean;
}

const Achpage = () => {
  const id = Cookies.get('_id');
  const [user, setUser] = useState<UserAchievements>({});

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="bg-[#243230] p-2 lg:p-3 rounded-md text-white flex flex-col gap-2 lg:gap-3 2xl:gap-4 items-center overflow-auto">
      <Achievement
        title="Welcome"
        icon="first-game"
        description="play your first game."
        accomplished={user.TotalMatch! > 0}
      />
      <Achievement
        title="Machine master"
        icon="clean-sheet"
        description="Win a game against bot."
        accomplished={user.Machine}
      />
      <Achievement
        title="Clean sheet"
        icon="clean-sheet"
        description="Win a game without accept any goal from opposite side."
        accomplished={user.cleanSheet}
      />
      <Achievement
        title="Amateur player"
        icon="victory-van"
        description="Reach level 1."
        hasProgression
        progression={user.Level! * 50}
      />
      <Achievement
        title="Advanced player"
        icon="speed-demon"
        description="Reach level 5."
        hasProgression
        progression={user.Level! * 20}
      />
      <Achievement
        title="Fifty frenzy"
        icon="fifty-frenzy"
        description="play 50 games."
        hasProgression
        progression={user.TotalMatch! * 2}
      />
    </div>
  );
};

export default Achpage;
