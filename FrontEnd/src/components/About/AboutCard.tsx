import React from 'react';

interface Props {
  image: string;
  name: string;
  description: string;
}

const AboutCard = ({ image, name, description }: Props) => {
  return (
    <div className=' hover:scale-105 duration-300 max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
      {/* Image Section */}
      <img
        src={image}
        alt={`${name}'s profile`}
        className='w-full h-48 object-cover'
      />
      {/* Details Section */}
      <div className='p-4'>
        <h2 className='text-xl font-bold text-gray-800'>{name}</h2>
        <p className='text-gray-600 mt-2'>{description}</p>
      </div>
    </div>
  );
};

export default AboutCard;
