import React, { useEffect, useRef, useState } from 'react'
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from "@giphy/js-fetch-api";
const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

import _ from 'lodash'
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

const gf = new GiphyFetch(apiKey)
function Giphy() {
  const gridRef = useRef(null);
  const [isloading, setisloading] = useState(false);
  const [value, setvalue] = useState("");
  const [error, seterror] = useState(false);
  const [gifs, setGifs] = useState([]);//stored the fetched gifs
  const fetchGifs = async (offset) => {
    return gf.search(value, { offset, limit: 10 });
  }

  const debouncedfetchGifs = _.debounce(async()=>{
    setisloading(true);
      seterror(null);

       try {
        const initialGifs = await fetchGifs(0);
        setGifs(initialGifs.data);
      } catch (error) {
        seterror(error.message);
      } finally {
        setisloading(false)
      }
  },500);//Debounced time of 500 milli seconds
  useEffect(() => {
    //fetch Gifs initially based on search terms
    const fetchInitialGifs = async () => {
      setisloading(true);
      seterror(null);

      try {
        const initialGifs = await fetchGifs(0);
        setGifs(initialGifs.data);
      } catch (error) {
        seterror(error.message);
      } finally {
        setisloading(false)
      }
    }
    fetchInitialGifs();
  }, []);

  const handleGifClick =(gif,e)=>{
    e.preventDefault();
    //console.log(gif);
    
    const gifUrl = gif.images.original.url;
    console.log(gifUrl);
  }

  return (
    <div ref={gridRef} className='w-full'>
      <input type="text" placeholder='Search for Gif.... ' className='border border-stroke dark:border-strokedark rounded-md p-2 w-full mb-2 outline-none mt-3 bg-transparent' value={value} onChange={(e) => {
        setvalue(e.target.value)
        debouncedfetchGifs(); //call debounced funtion on every change
      }} />

      {isloading && <p>Loading GIFs...</p>}
      {error && <p className='text-red'>Error: {error}</p>}
      <div className="h-48 overflow-auto no-scrollbar ">
        {gifs.length >0 ?<Grid width={gridRef.current?.offsetWidth} columns={8} gutter={6} fetchGifs={fetchGifs} key={value} onGifClick={handleGifClick} data={gifs} /> : <div className='flex flex-col justify-center h-full items-center space-y-2'>
          <MagnifyingGlassIcon size={48} weight='bold'/>
          <span className='text-xl text-body dark:text-white font-semibold'>Please search for any Gif</span> 
          </div>}
      </div>
    </div>
  )
}

export default Giphy
