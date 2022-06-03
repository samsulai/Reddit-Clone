import React from 'react'
import {  useSession } from 'next-auth/react'
import Avatar from './Avatar'
function PostBox() {
	const {data : session} = useSession();
	return (
		<form>
		<div className="flex items-center space-x-3 ">
{/* avatar*/}
<Avatar />
<input disabled={!session} className=" flex-1 bg-gray-50 p-2 pl-5 rounded-md outline-none" type="text" placeholder={session ? 'create a post by entering a title' : 'Sign In to Post'}/>
		</div>
		</form>
	)
}

export default PostBox