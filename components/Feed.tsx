import { useQuery } from '@apollo/client'
import React from 'react'
import { Waveform } from '@uiball/loaders'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC, GET } from '../graphql/queries'
import Post from './Post'

type Props  = {
	topic? : string
}
function Feed({ topic } : Props) {
const {data, error} =  !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, {
	variables : {
		topic : topic,
	},
})


const posts : Post[] = !topic ? data?.getPostList : data?.getPostListByTopic

return (
	<div className="mt-4 space-y-4">
	{!posts && (
        <div className="flex w-full items-center justify-center p-10 text-xl">
          <Waveform  size={50} speed={0.9} color="#ff4501" />
        </div>
      ) }
      
{posts?.map((post) => (
<Post key={post.id} post={post}/>
	))}
</div>

) 

}
export default Feed