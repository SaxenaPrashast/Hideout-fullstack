import React from 'react'
import extractLinks from "../../utils/extractLinks.js"
import MicroLink from "@microlink/react"
import { Check, CheckIcon, Checks, ChecksIcon } from '@phosphor-icons/react';

function Text({
  incoming,
  author,
  timestamp,
  read_receipt,// read | delivered | sent
  content,
}) {

  const {links, originalString} = extractLinks(content);
  return incoming ? <div className='max-w-125'>
    <p className='mb-2.5 text-sm font-medium'>{author}</p>
    <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2 space-y-2'>
      <p className='text-white' dangerouslySetInnerHTML={{__html : originalString}}></p>
    {links.length >0 &&  <MicroLink style={{width:  "100%"}} url={links[0]}/>}
    </div>
    <p className='text-xs'>{timestamp}</p>
  </div> : <div className='max-w-125 ml-auto'>

    <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3 space-y-2'>
      <p className='text-white' dangerouslySetInnerHTML={{__html : originalString}}></p>
      {links.length >0 &&  <MicroLink style={{width:  "100%"}} url={links[0]}/>}
    </div>

    <div className=' flex flex-row items-center justify-end space-x-2 '>
      <div className={`${read_receipt != 'read' ? "text-body dark:text-white" : "text-primary"}`}>
        {read_receipt != 'sent' ? <ChecksIcon weight='bold' size={18} /> : <CheckIcon weight='bold' size={18}/>}
      </div>
    <p className='text-xs'>{timestamp}</p>
    </div>
    
  </div>
}

export default Text


// single tick - gray - sent
// two tick - gray - delivered but not read
// two tick - blue - read