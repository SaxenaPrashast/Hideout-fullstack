import React from 'react'

function Verification() {
  return (
    <div className='overflow-hidden px-4 dark:bg-boxdark-2 sm:px-8'>
      <div className='flex h-screen flex-col items-center justify-center overflow-hidden'>
        <div className='no-scrollbar overflow-y-auto py-20'>
            <div className='mx-auto w-full max-w-[480px] '>
                <div className='text-center'>
                    <div className='bg-white p-4 shadow-xl rounded-xl dark:bg-boxdark lg:p-7.5 xl:p-12.5'>
                        <h1 className='mb-2.5 text-3xl font-black leading-[48p] text-black dark:text-white capitalize'>Verify your Account </h1>
                        <p className='mb-7.5'>Enter the 4 digit code sent to your registered e-mail id</p>

                        <form action="">
                            <div className='flex items-center gap-4.5 '>
                                {Array.from({length:4}).map((_,index)=><input type='text' key={index} className='w-full rounded-md border-[1.5px] border-stroke bg-transparent px-5 py-3 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'/>)}
                            </div>
                             {/* Verify Button */}
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    Verify
                  </button>
                   {/* Didn't receive code */}
                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Didn’t receive the code?{' '}
                    <button
                      type="button"
                      onClick={() => alert('Resend logic here')}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Resend
                    </button>
                  </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Verification
