import type { NextPage } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {

  const [accessToken, setAccessToken] = useState('');
  const [enumName, setEnumName] = useState('');
  const [enumLength, setEnumLength] = useState(1);
  const [enumList, setEnumList] = useState([]);

  const githubRedirectURL = 'http://localhost:3033/auth/github/callback';
  const path = '/';

  useEffect(()=>{
    if(document.cookie && document.cookie?.split("=")[1]){
      setAccessToken(document.cookie?.split("=")[1]);
    }else{
      console.log('github not logged in');
    }
  },[]);

  const onSubmitClicked = () =>{
    const data = {
       enumName,
       enumList,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    }
    axios.post('http://localhost:3033/enum/create',data, {headers})
      .then(res=>{console.log(res.data)})
      .catch(err => {console.log(err)});
  }

  const renderEnums = () =>{
    let arr = [];
    arr.push(<tr key={0}>
      <th>Repo URL</th>
      <th>File extension</th>
    </tr> );

    for(let i=0; i<enumLength; i++){
      arr.push(
        <tr key={i+1}>
          <th>
            <input 
              placeholder='Link to Repository' 
              onChange={(evt)=>{
                  let arr = [...enumList];
                  arr[i] = {
                    ...arr[i], 
                    'repo_name': evt.target.value
                  };
                  setEnumList(arr);
                }}/>
            </th>
          <th>
            <input 
              placeholder='File extension after .' 
              onChange={(evt)=>{
                  let arr = [...enumList];
                  arr[i] = {
                    ...arr[i], 
                    'file_extension': evt.target.value
                  };
                  setEnumList(arr);
                }}/>
            </th>
        </tr> 
      )
    }
    return arr;
  }

  return (
    <div>
      <h3 style={{margin:20}}>Syntax Protocol v0.0.1 </h3>
      {!accessToken?
      <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_url=${githubRedirectURL}?path=${path}&scope=repo%20user%20read:packages`}
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
            <table>
              <tbody>
                {renderEnums()}
              </tbody>
            </table>
            <button 
              onClick={()=>{setEnumLength(enumLength+1)}}>
              add repo
            </button>
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
