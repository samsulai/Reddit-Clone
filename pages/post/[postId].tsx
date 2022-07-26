import React from 'react'
import { useRouter } from 'next/router'
import {GET_POST_BY_POST_ID} from '../../graphql/queries'
import { useQuery, useMutation } from '@apollo/client' 
import Post from '../../components/Post'
import Avatar from '../../components/Avatar'
import {useSession} from 'next-auth/react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {ADD_COMMENT} from '../../graphql/mutations'
import toast from 'react-hot-toast'
import TimeAgo from 'react-timeago'

type FormData = {
	comment : string
}

function postPage() {
	const router = useRouter()
	const {data : session} = useSession()
	const [addComment] = useMutation(ADD_COMMENT, {
		refetchQueries : [GET_POST_BY_POST_ID, ' getPostListByPostId']
	})
	const {data} = useQuery(GET_POST_BY_POST_ID, {
		variables : {
			post_id : router.query.postId
		}
	})
	const post : Post = data?.getPostListByPostId
	const {
		register,handleSubmit, watch, setValue, formState:{errors},
	} = useForm<FormData>()
	const onSubmit : SubmitHandler<FormData> = async (data) => {
console.log(data)
const notification = toast.loading('Posting your comment.....')
try {
      await addComment({
        variables: {
          post_id: router.query.postId,
          username: session?.user?.name,
          text: data.comment,
        },
      })

      toast.success('Comment posted!', {
        id: notification,
      })
    } catch (error) {
      console.log(error)
      toast.error('Whoops something went wrong!', {
        id: notification,
      })
    } finally {
      setValue('comment', '')
    }

	} 
	return (
		<div className="mx-auto my-7 max-w-5xl">
			<Post post={post}/>

			<div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
			<p className="text-sm">Comment as <span className="text-red-500">{session?.user?.name}</span></p>
			<form onSubmit={handleSubmit(onSubmit)} className="flex space-y-2 flex-col">
            
            <textarea {...register('comment')} disabled={!session} className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50 placeholder={session ? 'What are your thoughts' : 'Sign in to comment.'}"/>
            <button className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200" type='submit'>Comment</button>
			</form>
			</div>
			<div className="-my-5 rounded-b-md border border-t-0 border-gray-400 bg-white py-5 px-5">
			<hr className="py-2" />
			{post?.comments.map((comment) => (
				<div className="relative flex items-center space-x-2 space-y-5" key={comment.id}>
				<hr className="absolute top-10 left-7 z-0 h-16 border"/>
				<div className="z-50">
				<Avatar  seed={comment.username} />
				</div>
				<div className="flex flex-col">
				<p className="py-2 text-sm text-gray-400">
				<span className="font-semibold text-gray-600">{comment.username}</span>.{' '}
				<TimeAgo date={comment.created_at} />
				</p>
				<p>{comment.text}</p>
				</div>

				</div>
			))}
			</div>
		</div>


	)
}

export default postPage