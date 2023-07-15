import ImageUpload from '@/components/profile/ImageUpload'
import Dashboard from '../Dashboard'
import AvatarProfile from '@/components/profile/Avatar'
import { countries } from 'country-flag-icons'
import { UserInfo } from '@/components/profile/UserInfo'
import { UserStats } from '@/components/profile/UserStats'


const Profile = () => {
  return (
      <Dashboard>
        <div className='bg-[#243230] flex flex-col'>
          <ImageUpload />
          <AvatarProfile/>
          <UserInfo />
          <UserStats />
        </div>
      </Dashboard>
  )
}

export default Profile
