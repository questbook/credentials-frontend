import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Home = () => {

  const [accessToken, setAccessToken] = useState('');
  const [enumName, setEnumName] = useState('');
  const [githubQuery, setgithubQuery] = useState('');
  const [nftQuery, setNftQuery] = useState('');
  const [stackoverflowQuery, setStackoverflowQuery] = useState('');
  const [credentials, setCredentials] = useState('');

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
    if(enumName){
      if(credentials==='github' && githubQuery){
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/create`,data, {headers})
        .then(res=>{
          if(res.data?.result?.error){
            alert('error: '+res.data.result.error)
          }else{
            alert("list created!")
          }
        })
        .catch(err => {console.log(err)});
      }
      if(credentials ==='erc721' && nftQuery){
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/create-erc721-list`,{enumName, nftQuery}, {headers})
        .then(res=>{
          if(res.data?.result?.error){
            alert('error: '+res.data.result.error)
          }else{
            alert("list created!")
          }
        })
        .catch(err => {console.log(err)});
      }
      if(credentials=== 'stackoverflow' && stackoverflowQuery){
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/stackoverflow/create`,{enumName, stackoverflowQuery}, {headers})
        .then(res=>{
          if(res.data?.result?.error){
            alert('error: '+res.data.result.error)
          }else{
            alert("list created!")
          }
        })
        .catch(err => {console.log(err)});
      }
    }else{
      alert('please enter the list name');
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

          <div style={{margin:20}} onChange={(evt)=>{setCredentials(evt.target.value);}}>
            <input type="radio" value="github" name="credentials" /> github
            <input type="radio" value="erc721" name="credentials" /> erc721
            <input type="radio" value="stackoverflow" name="credentials" /> stackoverflow
            <input type="radio" value="erc20" name="credentials" /> erc20 (WIP)
          </div>

          {credentials==='github' && <div style={{margin:20}}>
            <label>Your githubQuery: </label>
            <input 
              style={{width: '1000px'}}
              placeholder='Github query for the list'
              onChange={(evt)=>{
                setgithubQuery(evt.target.value);
              }}/>
          </div>}

          {credentials ==='erc721' && <div style={{margin:20}}>
            <label>Your ERC721 query: </label>
            <input 
              style={{width: '1000px'}}
              placeholder='ERC721 query for the list'
              onChange={(evt)=>{
                setNftQuery(evt.target.value);
              }}/>
          </div>}

          {credentials=== 'stackoverflow' && <div style={{margin:20}}>
            <label>Your Stackoverflow query: </label>
            <input 
              style={{width: '1000px'}}
              placeholder='Stackoverflow query for the list'
              onChange={(evt)=>{
                setStackoverflowQuery(evt.target.value);
              }}/>
          </div>}

          {credentials ==='erc20' && <div style={{margin:20}}>
            Waiting for the subgraph to finish indexing
            </div>}
          
          <div style={{marginLeft: 20, marginTop:50}}>
            <button onClick={()=>{onSubmitClicked()}}>submit</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Home
