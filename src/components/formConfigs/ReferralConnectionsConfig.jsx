import {
    Input,
    Textarea,
    Select,
    SelectItem,
    Button,
    Chip,
    Divider
} from "@heroui/react";
import { useState } from "react";
import { categoryOptions, specialtyOptions } from "../../Utils/filters";

const ReferralConnectionsConfig = () => {
    const [formData, setFormData] = useState({
        practiceName: "",
        category: "",
        primaryDoctor: "",
        yearEstablished: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        specialties: [],
        notes: ""
    });

    // const categories = [
    //     "General Dentistry",
    //     "Orthodontics",
    //     "Oral Surgery",
    //     "Periodontics",
    //     "Endodontics",
    //     "Prosthodontics",
    //     "Pediatric Dentistry"
    // ];



    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSpecialtyToggle = (specialty) => {
        setFormData(prev => {
            if (prev.specialties.includes(specialty)) {
                return {
                    ...prev,
                    specialties: prev.specialties.filter(s => s !== specialty)
                };
            } else {
                return {
                    ...prev,
                    specialties: [...prev.specialties, specialty]
                };
            }
        });
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
    };

    return (
        <>
            {/* Basic Information Section */}
            <div className="flex flex-col gap-5">

                <div className="space-y-4 border p-4 rounded-xl border-text/10">
                    <h5 className="text-sm font-medium mb-3 text-text">Basic Information</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            size="sm"
                            label="Practice Name"
                            value={formData.practiceName}
                            onChange={(e) => handleInputChange("practiceName", e.target.value)}
                            required
                            variant="flat"
                        />

                        <Select
                            size="sm"
                            label="Category"
                            selectedKeys={formData.category ? [formData.category] : []}
                            onChange={(e) => handleInputChange("category", e.target.value)}
                            variant="flat"
                        >
                            {categoryOptions.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            size="sm"
                            label="Primary Doctor"
                            value={formData.primaryDoctor}
                            onChange={(e) => handleInputChange("primaryDoctor", e.target.value)}
                            variant="flat"
                        />

                        <Input
                            size="sm"
                            label="Year Established"
                            value={formData.yearEstablished}
                            onChange={(e) => handleInputChange("yearEstablished", e.target.value)}
                            type="number"
                            variant="flat"
                        />
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 border p-4 rounded-xl border-text/10">
                    <h5 className="text-sm font-medium mb-3 text-text">Contact Information</h5>
                    <Input
                        size="sm"
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                        variant="flat"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            size="sm"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            variant="flat"
                        />

                        <Input
                            size="sm"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            variant="flat"
                        />
                    </div>

                    <Input
                        size="sm"
                        label="Website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        variant="flat"
                    />
                </div>

                {/* Specialties Section */}
                <div className="space-y-4 border p-4 rounded-xl border-text/10">
                    <h5 className="text-sm font-medium mb-3 text-text">Specialties</h5>

                    <div className="flex flex-wrap gap-2">


                        <Select
                            size="sm"
                            variant="flat"
                            label="Specialties"
                            selectionMode="multiple"
                            placeholder="Select specialties"
                            selectedKeys={formData.specialties}
                            onSelectionChange={(keys) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    specialties: Array.from(keys),
                                }));
                            }}
                            className="max-w-md"
                        >
                            {specialtyOptions.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                    {specialty}
                                </SelectItem>
                            ))}
                        </Select>

                        <div className={`flex flex-wrap gap-2 ${formData.specialties.length > 0 ? ' mt-3 ' : ' mt-0 '}`}>
                            {formData.specialties.map((specialty) => (
                                <Chip size="sm"
                                    key={specialty}
                                    variant="flat"
                                    color="primary"
                                    onClose={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            specialties: prev.specialties.filter((s) => s !== specialty),
                                        }))
                                    }
                                >
                                    {specialty}
                                </Chip>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4 border p-4 rounded-xl border-text/10">
                    <h5 className="text-sm font-medium mb-3 text-text">Notes</h5>
                    <Textarea
                        size="sm"
                        placeholder="Any additional notes about this practice..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        variant="flat"
                        minRows={3}
                    />
                </div>

            </div>

            {/* <div className="flex justify-end gap-3 pt-4">
                <Button color="default" variant="flat">
                    Cancel
                </Button>
                </div> */}
            <Button color="primary" type="submit" onPress={handleSubmit}>
                Test Save Changes
            </Button>

        </>
    );
};

export default ReferralConnectionsConfig;