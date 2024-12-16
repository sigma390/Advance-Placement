import { devs } from '@/data';

import AboutCard from './AboutCard';

const AboutDevs = () => {
  return (
    <div className='m-10'>
      {/* Heading */}
      <h1 className='text-4xl font-bold mb-10 text-center'>
        About Our Developers
      </h1>

      {/* Grid Container */}
      <div className='grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-8'>
        {devs.map((developer) => (
          <AboutCard
            image={developer.imgUrl}
            name={developer.name}
            description={developer.description}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutDevs;
