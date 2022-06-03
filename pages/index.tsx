import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/header'
import PostBox from '../components/PostBox'
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        
      </Head>

      {/*PostBox*/}
<PostBox />
      <div>
       {/*Feed*/}
      </div>

      
    </div>
  )
}

export default Home
