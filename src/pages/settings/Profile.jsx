import { addToast, Button, Input, Select, SelectItem } from '@heroui/react';
import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

const specialties = [
  { label: 'Orthodontics', value: 'orthodontics' },
  { label: 'General Dentistry', value: 'general_dentistry' },
  { label: 'Oral Surgery', value: 'oral_surgery' },
  { label: 'Endodontics', value: 'endodontics' },
  { label: 'Periodontics', value: 'periodontics' },
  { label: 'Other', value: 'other' },
];

const fields = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email Address', type: 'email' },
  { name: 'phone', label: 'Phone Number', type: 'text' },
  { name: 'practice', label: 'Practice Name', type: 'text' },
];

const Profile = () => {
  const initialData = {
    firstName: 'Dr. Sarah',
    lastName: 'Martinez',
    email: 'sarah.martinez@tangeloortho.com',
    phone: '+1 (918) 555-0100',
    practice: 'Tangelo Orthodontics',
    specialty: 'orthodontics',
    image: null,
  };


  const [formData, setFormData] = useState(initialData);

  const [previewUrl, setPreviewUrl] = useState(
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
  );

  const isFormChanged = () => {
    for (let key in initialData) {
      if (key === 'image') {
        if (formData.image !== null) return true;
      } else if (formData[key] !== initialData[key]) {
        return true;
      }
    }
    return false;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecialtyChange = (selected) => {
    const value = Array.from(selected)[0];
    setFormData({ ...formData, specialty: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormChanged()) {
      addToast({
        title: "No Changes",
        description: "Make some changes",
        color: 'danger',
      });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        data.append('image', value);
      } else {
        data.append(key, value);
      }
    });

    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    addToast({
      title: "Success",
      description: "Profile Updated",
      color: 'success',
    });
  };


  return (
    <form onSubmit={handleSubmit}>
      <h4 className='flex gap-2 items-center mb-4'>
        <FiUser className='w-4 h-4' />
        <span className='text-sm !font-extralight'>Profile Information</span>
      </h4>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={previewUrl}
          alt="Profile"
          className='rounded-full w-20 h-20 object-cover'
        />
        <div>
          <Input
            size='sm'
            type='file'
            accept='image/*'
            className='w-fit '
            onChange={handleImageChange}
            variant='bordered'
          />
          <p className='text-xs'>JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ name, label, type }) => (
          <Input
            key={name}
            size='sm'
            type={type}
            name={name}
            label={label}
            labelPlacement='outside'
            value={formData[name]}
            onChange={handleChange}
          />
        ))}

        <div className="">
          <Select
            size='sm'
            name='specialty'
            label='Medical Specialty'
            labelPlacement='outside'
            selectedKeys={[formData.specialty]}
            onSelectionChange={handleSpecialtyChange}
          >
            {specialties.map(({ label, value }) => (
              <SelectItem key={value} textValue={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <Button size='sm' type="submit" className="bg-text text-background">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default Profile;
