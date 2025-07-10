import React, { useRef, useState } from 'react'

function Giphy() {
    const gridRef = useRef(null);
    const [isloading , setisloading] = useState(false);
    const [value, setvalue ]= useState("");
    const [error, seterror ]=useState(false);
  return (
    <div ref={gridRef} className='w-full'>
        <input type="text" placeholder='Search for Gif.... ' className='border border-stroke rounded-md p-2 w-full mb-2 outline-none mt-3' value={value} onChange={(e)=>{
            setvalue(e.target.value)
        }}/>

        {isloading && <p>Loading GIFs...</p>}
        {error && <p className='text-red'>Error: {error}</p>}
         <div></div>
    </div>
  )
}

export default Giphy
