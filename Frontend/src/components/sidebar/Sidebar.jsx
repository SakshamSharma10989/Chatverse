import React from 'react'

import Conv from './Conv.jsx'
import LogutButton from './LogutButton.jsx'
import SearchInput from './SearchInput.jsx'


const Sidebar = () => {
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
         <SearchInput/>
        <div className='divider px-3'></div>
        <Conv/>
        <LogutButton/>
    </div>
  )
}

export default Sidebar