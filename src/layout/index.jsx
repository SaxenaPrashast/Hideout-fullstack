import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './Sidebar'

function index() {
    return (
        <div className='h-[calc(1000vh)] overflow-hidden sm:h-screen'>
            <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex'>
                {/* Sidebar*/}
                <Layout />

                <Outlet />
            </div>
        </div>
    )
}

export default index
