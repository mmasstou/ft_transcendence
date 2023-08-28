import React from 'react'
import { IconType } from 'react-icons'

interface btnProps {
	icon?: IconType,
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
	size?: number,
}

const CustumBtn: React.FC<btnProps> = ({
	icon: Icon,
	onClick,
	size,
}) => {
  return (
	<button onClick={onClick} className='hover:opacity-[80%]'>
		{Icon && (<Icon size={size} />)}
	</button>
  )
}

export default CustumBtn