import React, { ReactNode } from 'react'

import SideBar from '@/components/main/SideBar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps): ReactNode => {
  return (
    <main className='flex h-min w-dvw bg-tbSecondary pt-24'>
      <SideBar />
      {children}
    </main>
  )
}

export default MainLayout