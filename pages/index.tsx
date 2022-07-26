import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/header'
import PostBox from '../components/PostBox'
import Feed from '../components/Feed'
const Home: NextPage = () => {
  return (
    <div className="my-7 max-w-5xl mx-auto">
      <Head>
        <title>Reddit Clone</title>
        
      </Head>

      {/*PostBox*/}
<PostBox />
      <div className="flex">
     
       <Feed />
      </div>

      
    </div>
  )
}

export default Home
