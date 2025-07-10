import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Group members'
}

type Props = {}

const MembersPage = (props: Props) => {
  return (
    <div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
        members
    </div>
  )
}

export default MembersPage