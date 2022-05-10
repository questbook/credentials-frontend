import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const User = () => {
  const router = useRouter()
  const { user_name } = router.query
  const [enumList, setEnumList] = useState([]);

  useEffect(()=>{
    if(user_name)
      axios.post('http://api.syntaxprotocol.xyz/enum/getlists',{user_name})
        .then(res=>{console.log(res.data); setEnumList(res.data);})
        .catch(err=>{console.log(err)});
  },[user_name])

  return (
    <div>
        <h3 style={{margin:20}}>Syntax Protocol v0.0.1 </h3>
        <div style={{margin:20}}>
            User: {user_name}
        </div>
        <div style={{margin:20}}>
            <h3>Lists you
                &apos;re part of:</h3>
            {enumList?.map((enumname,i)=><div key={i}>{enumname.list_name}</div>)}
        </div>
    </div>
    );
}

export default User