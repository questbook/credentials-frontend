import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const User = () => {
  const router = useRouter()
  const { user_name } = router.query
  const [enumList, setEnumList] = useState([]);

  useEffect(()=>{
    if(user_name)
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enum/getlists`,{user_name})
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
                <table>
                  <tbody>
                    <tr>
                      <th>List Name</th>
                      <th>Creator</th>
                    </tr>
                    {enumList?.map((enumname,i)=><tr key={i}>
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