import { Button } from '@heroui/react'
import React from 'react'

const ComponentHeader = ({ heading, subHeading, buttons }) => {
    return (
        <div className="md:px-7 px-4 py-4 md:py-8 bg-white flex justify-between border-b-1 border-gray-200">
            <div>
                <h3  className=' text-[20px]'>{heading}</h3>
                <p className='text-gray-600 text-[14px]'>{subHeading}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {buttons?.map((btn, index) => (
                    <Button key={index} onPress={btn.onClick} {...btn.props} className={`${btn.bgColor} ${btn.textColor} border border-gray-300`}>
                        <span>{btn.icon}</span>
                        {btn.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ComponentHeader
