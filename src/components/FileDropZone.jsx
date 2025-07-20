import React, { useEffect, useRef } from 'react'
import DropZone from 'dropzone';
import { UploadSimpleIcon } from '@phosphor-icons/react';
function FileDropZone({
    acceptedFiles = "image/*,video/*",
    maxFileSize = 16*1024*1024,
    url = "/file/post",

}) {
    const dropzoneRef = useRef(null);
    const formRef = useRef(null);

    useEffect(()=>{
        DropZone.autoDiscover = false;
        if(!dropzoneRef.current && formRef.current){
            dropzoneRef.current = new DropZone(formRef.current,{
                url,
                acceptedFiles,
                maxFilesize: maxFileSize/(1024*1024) //Dropzone expects the max file size in MB 
            })
        }
        return ()=>{
            if(dropzoneRef.current){
                dropzoneRef.current.destroy();
                dropzoneRef.current = null;
            }
        }
    },[]);
  return (
    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark'>
      <div className='p-6.5'>
        <form action={url} ref={formRef} id='upload' className='dropzone rounded-md !border-dashed !border-bodydark1 !bg-gray
      !hover:!border-primary !dark:!border-strokedark !dark:bg-graydark !dark:hover:!border-primary'>
        <div className='dz-message'>
            <div className='mb-2.5 flex justify-center flex-col items-center'>
                <div className='shadow-10 flex h-15 w-15 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white'>
                    <UploadSimpleIcon size={24}/>
                </div>
                <span className='font-medium text-black dark:text-white'>
                    Drop Files here to Upload
                </span>
            </div>
        </div>
      </form>
      </div>
    </div>
  )
}

export default FileDropZone
