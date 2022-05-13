import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
let Web3 = require('web3')

const User = () => {
  const router = useRouter()
  const { user_name } = router.query
  const [enumList, setEnumList] = useState([]);
  const [profileJwt, setProfileJwt] = useState();
  const [user, setUser] = useState();
  const githubRedirectURL = `${process.env.NEXT_PUBLIC_API_URL}/github/auth/callback`;
  const path = `/${user_name}`;

  useEffect(()=>{
    if(user_name)
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/list/getlists`,{user_name})
        .then(res=>{setEnumList(res.data);})
        .catch(err=>{console.log(err)});
  },[user_name]);

  useEffect(()=>{
    if(Cookies.get() && Cookies.get('profile-jwt') ){
      const profileCookie = Cookies.get('profile-jwt') ;
      setProfileJwt(profileCookie);

      const decoded = jwt.verify(profileCookie, process.env.NEXT_PUBLIC_secret);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': decoded
      }
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/get-user/`, {headers})
        .then(res=>{
          setUser(res.data);
        })
        .catch(err => {console.log(err)});

    }else{
      console.log('github not logged in');
    }
  },[]);

  function signProof(){
    window.ethereum ?
        ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
          let w3 = new Web3(ethereum);
          const decoded = jwt.verify(Cookies.get('profile-jwt'), process.env.NEXT_PUBLIC_secret);
          const hashAccessToken = w3.utils.sha3(decoded);
          w3.eth.sign(hashAccessToken, accounts[0])
          .then((signature)=>{
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': decoded
            }
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/claim-github/${signature}`, {headers})
              .then(res=>{alert(res.data);})
              .catch(err => {console.log(err)});
          })
          .catch((err)=>{console.log('err', err)});

        }).catch((err) => console.log(err))
      : console.log("Please install MetaMask")
  }

  return (
    <div>
        <h3 style={{margin:20}}>Syntax Protocol v0.0.1 </h3>
        <div style={{margin:20}}>
            User: {user_name}
            {user_name!==user?.login?
              <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectURL}?path=${path}&scope=repo%20user%20read:packages`}
              style={{background: 'yellow', padding: 10, marginLeft: 20}}>
                <button>claim your GitHub</button>
              </a>:null}
            {user_name===user?.login?<button onClick={()=>{signProof()}} style={{marginLeft: 20}}>
                Sign Proof</button>:null}
        </div>
        <div style={{margin:20}}>
            <h3>Lists you&apos;re part of:</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>List Name</th>
                      <th>Creator</th>
                    </tr>
                    {enumList?.map((enumname,i)=>
                            <tr key={i}>
                              <td>
                                {enumname.list_id}
                              </td>
                              <td>
                                <a href={'https://github.com/'+enumname.list_created_by} target='_blank' rel="noreferrer">
                                  {enumname.list_created_by}
                                </a>
                              </td>
                            </tr>)}
                  </tbody>
                </table>
        </div>
    </div>
    );
}

export default User