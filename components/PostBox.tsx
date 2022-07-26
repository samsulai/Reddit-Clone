import React, {useState} from 'react'
import {  useSession } from 'next-auth/react'
import Avatar from './Avatar'
import {LinkIcon, PhotographIcon} from '@heroicons/react/outline'
import {useForm} from 'react-hook-form'
import {useMutation} from '@apollo/client'
import client from '../apollo-client'
import {ADD_POST} from '../graphql/mutations'
import {ADD_SUBBREDDIT} from '../graphql/mutations'
import {GET_SUBREDDIT_BY_TOPIC} from '../graphql/queries'
import {GET_ALL_POSTS} from '../graphql/queries'
import toast from 'react-hot-toast'



type FormData = {

postTitle : string
postBody : string
postImage : string
subreddit : string

}	
type Props = {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBBREDDIT)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const [imageBoxOpen, setimageBoxOpen] = useState<boolean>(false)

  const submitHandler = handleSubmit(async (formData) => {
    console.log(formData)
    const notification = toast('Creating new post...')

    try {
      // Query for subreddit topic
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        fetchPolicy: 'no-cache',
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      })

      const subredditExists = getSubredditListByTopic.length > 0

      if (!subredditExists) {
        // create subreddit...
        console.log('Subreddit is NEW! -> creating a new subreddit')

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: formData.postImage || '',
            subreddit_id: newSubreddit.id,
            username: session?.user?.name,
          },
        })

        console.log('New post added:', newPost)
        toast.success('New post created!', {
          id: notification,
        })
      } else {
        // use existing subreddit
        console.log('Subreddit exists! -> using existing subreddit')
        console.log(getSubredditListByTopic)

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: formData.postImage || '',
            subreddit_id: getSubredditListByTopic[0].id,
            username: session?.user?.name,
          },
        })

        console.log('New post added:', newPost)
        toast.success('New post created!', {
          id: notification,
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('Whoops something went wrong!', {
        id: notification,
      })
    } finally {
      // After the post has been added
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
      setimageBoxOpen(false)
    }
  })


  
	return (
		<form  onSubmit={submitHandler} className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 bg-white p-2">
		<div className="flex items-center space-x-3 ">
{/* avatar*/}
<Avatar />
<input {...register('postTitle', {required : true})} disabled={!session} className=" flex-1 bg-gray-50 p-2 pl-5 rounded-md outline-none" type="text"
 placeholder={session ? subreddit ? `create a post in r/${subreddit}` : 'create a post by entering a title' : 'Sign In to Post'}/>
		<PhotographIcon onClick = {() => setimageBoxOpen(!imageBoxOpen)}className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`} />
		<LinkIcon className=" h-6 text-gray-300"/>
		</div>
		{!!watch('postTitle') && (
<div  className="flex flex-col py-2">
{/* Body */}
<div className="flex items-center px-2">
<p className="min-w-[90px]">Body:</p>
<input className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('postBody')} type="text" placeholder='Text (Optional)' />
</div>
{!subreddit && (

<div className="flex items-center px-2">
<p className="min-w-[90px]">subreddit:</p>
<input className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('subreddit', {required : true})} type="text" placeholder='i.e NextJs' />
</div>
	)}

{imageBoxOpen && (
<div className="flex items-center px-2">
<p className="min-w-[90px]">Image url:</p>
<input className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('postImage')} type="text" placeholder='Optional...' />
</div>
	)}
{/* Errors*/}
{Object.keys(errors).length > 0 && (
	<div className="space-y-2 p-2 text-red-500">
{
	errors.postTitle?.type === 'required' && (
<p>A postTitle is required</p>
	)}
{
	errors.subreddit?.type === 'required' && (
<p>A subreddit is required</p>
	)}

</div>
	)}
	{!!watch('postTitle') &&( <button type="submit" className="w-full rounded-full bg-blue-400 p-2 text-white">Create Post</button>)}
</div>

)}
		</form>
	)}

export default PostBox