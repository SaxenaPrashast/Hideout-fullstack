import { CaretDownIcon, GlobeSimpleIcon } from '@phosphor-icons/react'
import React, { useState } from 'react'

function SelectInput() {
    const [selectedOption, setSelectedOption] = useState('');
    return (
        <div>
            <label htmlFor="" className='mb-3 block text-black dark:text-white'>
                Select Country
            </label>

            <div className='relative z-10 bg-white dark:bg-form-input'>
                <span className='absolute top-1/2 left-4 -translate-y-1/2'>
                    <GlobeSimpleIcon size={20} />
                </span>
                <select
                    value={selectedOption}
                    onChange={(e) => {
                        setSelectedOption(e.target.value);
                    }}
                    className={`w-full appearance-none rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-10 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                >
                    <option value="" disabled hidden className='text-body dark:text-bodydark'>
                        Select Country
                    </option>
                    <option value="India" className='text-body dark:text-bodydark'>India</option>
                    <option value="US" className='text-body dark:text-bodydark'>US</option>
                    <option value="Germany" className='text-body dark:text-bodydark'>Germany</option>
                </select>

                <span className='absolute top-1/2 right-4 z-10 -translate-y-1/2'>
                    <CaretDownIcon size={20} />
                </span>
            </div>
        </div>
    )
}

export default SelectInput
