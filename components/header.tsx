import React from 'react'
import Image from 'next/image'
function Header() {
	return (
		<div>
			<div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
			<Image src="https://links.papareact.com/fqy" objectFit="contain" layout="fill"/>
			</div>
		</div>
	)
}

export default Header