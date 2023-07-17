import ImageUpload from '@/components/profile/ImageUpload'
import Dashboard from '../Dashboard'
import AvatarProfile from '@/components/profile/Avatar'
import { countries } from 'country-flag-icons'
import { UserInfo } from '@/components/profile/UserInfo'
import { UserStats } from '@/components/profile/UserStats'
import { Navbar } from '@/components/profile/Navbar'


const Profile = () => {
  return (
      <Dashboard>
        <div className='flex flex-col'>
          <div className='bg-[#243230]'>
            <ImageUpload />
            <AvatarProfile/>
            <UserInfo />
            <UserStats />
          </div>
          <Navbar />
        </div>
      </Dashboard>
  )
}

export default Profile
