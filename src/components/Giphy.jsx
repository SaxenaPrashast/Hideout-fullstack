import React, { useEffect, useRef, useState } from 'react'
import {Grid} from '@giphy/react-components';
import { GiphyFetch } from "@giphy/js-fetch-api";
const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

import _ from 'lodash'

const gf = new GiphyFetch(apiKey)
function Giphy() {
    const gridRef = useRef(null);
    const [isloading , setisloading] = useState(false);
    const [value, setvalue ]= useState("");
    const [error, seterror ]=useState(false);
    const fetchGifs = async(offset)=>{
      return gf.search(value,{offset,limit: 10});
    }

    useEffect(()=>{

    },[]);

  return (
    <div ref={gridRef} className='w-full'>
        <input type="text" placeholder='Search for Gif.... ' className='border border-stroke rounded-md p-2 w-full mb-2 outline-none mt-3' value={value} onChange={(e)=>{
            setvalue(e.target.value)
        }}/>

        {isloading && <p>Loading GIFs...</p>}
        {error && <p className='text-red'>Error: {error}</p>}
         <div className="h-48 overflow-auto no-scrollbar "></div>
    </div>
  )
}

export default Giphy
