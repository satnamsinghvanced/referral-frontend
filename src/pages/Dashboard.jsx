import React from 'react'
import ComponentContainer from '../components/common/ComponentContainer'

const Dashboard = () => {

    const headingDate = {
        heading: 'Dashboard Overview',
        subHeading: "Welcome back! Here's what's happening with your referrals today.",
    }

    return (
        <ComponentContainer
            headingDate={headingDate}
        >
        </ComponentContainer>
    )
}

export default Dashboard