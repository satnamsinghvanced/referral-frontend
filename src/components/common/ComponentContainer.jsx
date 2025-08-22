import React from 'react'
import ComponentHeader from './ComponentHeader'

const ComponentContainer = ({ headingDate, children }) => {
    return (
        <div className="flex flex-col h-full ">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-background">
                <ComponentHeader
                    heading={headingDate.heading}
                    subHeading={headingDate.subHeading}
                    buttons={headingDate.buttons}
                />
            </div>
            <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-8 overflow-y-scroll" >
                {
                    children
                }
            </div>
        </div>
    )
}

export default ComponentContainer