import { CheckIcon, ChecksIcon } from '@phosphor-icons/react'
import React from 'react'
import Waveform from '../Waveform' 
function Voice({
  incoming,
  author,
  timestamp,
  read_receipt
}) {
  return incoming ? <div className='max-w-125'>
    <div className='mb-2.5 rounded-2xl rounded-tl-none px-5 py-3 bg-gray dark:bg-boxdark-2'>

    </div>
{/* Waveform */}
 <Waveform incoming={incoming}/>
<p className='text-xs'>{timestamp}</p>
  </div> : <div className='ml-auto max-w-125'>
    <div className='mb-2.5 rounded-2xl rounded-br-none px-5 py-3  '>
      {/* Waveform */}
     <Waveform incoming={incoming} />
    </div>
    <div className=' flex flex-row items-center justify-end space-x-2 '>
      <div className={`${read_receipt != 'read' ? "text-body dark:text-white" : "text-primary"}`}>
        {read_receipt != 'sent' ? <ChecksIcon weight='bold' size={18} /> : <CheckIcon weight='bold' size={18}/>}
      </div>
    <p className='text-xs text-right'>{timestamp}</p>
    </div>
  </div>
}

export default Voice
