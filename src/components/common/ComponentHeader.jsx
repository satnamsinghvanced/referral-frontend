import { Button } from '@heroui/react'
import React from 'react'

const ComponentHeader = ({ heading, subHeading, buttons }) => {
    return (
        <div className=' md:px-7 px-4 py-4 md:py-8 bg-white flex justify-between border-b-1 border-gray-200'>
            <div>
                <h3>{heading}</h3>
                <p>{subHeading}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {buttons?.map((btn, index) => (
                    <Button key={index} onPress={btn.onClick} {...btn.props}>
                        {btn.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ComponentHeader
