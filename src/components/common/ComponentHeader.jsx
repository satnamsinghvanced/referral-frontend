import { Button } from '@heroui/react'
import React from 'react'

const ComponentHeader = ({ heading, subHeading, buttons }) => {
    return (
        <div className=' md:px-7 px-4 py-3 md:py-6 bg-background flex justify-between border-b-1 border-text/10 dark:border-text/30'>
            <div>
                <h3 className='text-lg'>{heading}</h3>
                <p className='text-sm font-light'>{subHeading}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {buttons?.map((btn, index) => (
                    <Button size='sm' key={index} onPress={btn.onClick} {...btn.props} className={`${btn.classNames ? btn.classNames : 'border border-text/30 '}`}>
                        {btn?.icon && btn.icon}
                        {btn.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ComponentHeader
