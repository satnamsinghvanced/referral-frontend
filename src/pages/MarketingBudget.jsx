import ComponentContainer from "../components/common/ComponentContainer"

const MarketingBudget = () => {
    const headingDate = {
        heading: 'Marketing Budget',
        subHeading: "Manage and track your marketing spend across all channels",
    }

    return (
        <ComponentContainer
            headingDate={headingDate}
        >
        </ComponentContainer>
    )
}

export default MarketingBudget