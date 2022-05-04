import type { NextPage } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {

  useEffect(()=>{
    if(document.cookie && document.cookie?.split("=")[1]){
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': document.cookie?.split("=")[1]
      }
      axios.get("http://localhost:3033/github/resume", {headers})
            .then(res=>{console.log(res.data)})
            .catch(err=>{console.log(err)});
    }else{
      console.log('github not logged in');
    }
  },[]);

  const githubRedirectURL = 'http://localhost:3033/auth/github/callback';
  const path = '/';

  return (
    <div>
      <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_url=${githubRedirectURL}?path=${path}&scope=repo%20user%20read:packages`}
            style={{background: 'yellow', padding: 10, margin: 10}}>
        <button>Authorise Github</button>
      </a>
    </div>
  )
}

export default Home
