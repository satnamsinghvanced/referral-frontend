import { Tab, Tabs } from "@heroui/react"
import LatestReviews from "./LatestReviews"
import Locations from "./Locations"
import NfcCard from "./NfcCard"
import Overview from "./Overview"

const ReviewToggle = () => {
    return (
        <>
            <Tabs aria-label="Options"
                classNames={{
                    tabList: "flex w-full rounded-full bg-foreground/5 text-xs bg-foreground/5 /5",
                    tab: "flex-1 px-4 py-1 text-xs font-medium transition-all",
                    cursor: "rounded-full text-xs",
                }}
                className="text-background w-full text-xs">

                <Tab key="overview"
                    title={
                        <div className='flex gap-2 items-center justify-center'>
                            <p>Overview</p>
                        </div>
                    }
                    className="text-sm">
                    <Overview />
                </Tab>

                <Tab key="locations"
                    title={
                        <div className='flex gap-2 items-center justify-center'>
                            <p>Locations</p>
                        </div>
                    }
                    className="text-sm">
                    <Locations />
                </Tab>


                <Tab key="nfc-cards"
                    title={
                        <div className='flex gap-2 items-center justify-center'>
                            <p>NFC Cards</p>
                        </div>
                    }
                    className="text-sm">
                    <NfcCard />
                </Tab>


                <Tab key="recent-reviews"
                    title={
                        <div className='flex gap-2 items-center justify-center'>
                            <p>Recent Reviews</p>
                        </div>
                    }
                    className="text-sm">
                    <LatestReviews />
                </Tab>

            </Tabs>
        </>
    )
}

export default ReviewToggle