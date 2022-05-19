import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Home = () => {

  const [accessToken, setAccessToken] = useState('');
  const [enumName, setEnumName] = useState('');
  const [githubQuery, setgithubQuery] = useState('');
  const [nftQuery, setNftQuery] = useState('');

  const githubRedirectURL = `${process.env.NEXT_PUBLIC_API_URL}/github/auth/callback`;
  const path = '/';

  useEffect(()=>{
    if(Cookies.get() && Cookies.get('github-jwt')){
      setAccessToken(Cookies.get('github-jwt'));
    }else{
      console.log('github not logged in');
    }
  },[]);

  const onSubmitClicked = () =>{
    const data = {
       enumName,
      githubQuery
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
    if(githubQuery){
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/create`,data, {headers})
      .then(res=>{console.log(res.data); alert("list created!")})
      .catch(err => {console.log(err)});
    }
    if(nftQuery){
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/create-erc721-list`,{enumName, nftQuery}, {headers})
      .then(res=>{console.log(res.data); alert("list created!")})
      .catch(err => {console.log(err)});
    }
  }

  return (
    <div>
      <h3 style={{margin:20}}>Syntax Protocol v0.0.1 </h3>
      {!accessToken?
      <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectURL}?path=${path}&scope=repo%20user%20read:packages`}
            style={{background: 'yellow', padding: 10, margin: 10}}>
        <button>Authorise Github</button>
      </a>:
      <div>
        <div>
          <div style={{margin:20}}>
            <label>Your list name: </label>
            <input 
              placeholder='enter your list name'
              onChange={(evt)=>{
                setEnumName(evt.target.value);
              }}/>
          </div>

          <div style={{margin:20}}>
            <label>Your githubQuery: </label>
            <input 
              style={{width: '1000px'}}
              placeholder='Github query for the list'
              onChange={(evt)=>{
                setgithubQuery(evt.target.value);
              }}/>
          </div>

          <div style={{margin:20}}>
            <label>Your ERC721 query: </label>
            <input 
              style={{width: '1000px'}}
              placeholder='ERC721 query for the list'
              onChange={(evt)=>{
                setNftQuery(evt.target.value);
              }}/>
          </div>
          
          <div style={{marginLeft: 20, marginTop:50}}>
            <button onClick={()=>{onSubmitClicked()}}>submit</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Home
