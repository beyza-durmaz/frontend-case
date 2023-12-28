import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import items from '../assets/types';
import './Multiselect.css';

const getCategoryData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return items;
};

const Multiselect: React.FC = () => {
  const { data, isLoading, isError } = useQuery<typeof items>('categoryData', getCategoryData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  
  useEffect(() => {
    const storedSelectedCategories = localStorage.getItem('selectedCategories');
    if (storedSelectedCategories) {
      setSelectedCategories(JSON.parse(storedSelectedCategories));
    }
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading data</div>;
  }
  
  const handleCheckboxChange = (category: string) => {
    const newSelectedCategories = [...selectedCategories];

    if (newSelectedCategories.includes(category)) {
      // Remove category if already selected
      newSelectedCategories.splice(newSelectedCategories.indexOf(category), 1);
    } else {
      // Add category if not selected
      newSelectedCategories.push(category);
    }

    // Update state and save to localStorage
    setSelectedCategories(newSelectedCategories);
    localStorage.setItem('selectedCategories', JSON.stringify(newSelectedCategories));
  };

  const filteredCategories = data?.data.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Separate selected and unselected categories
  const selectedCategoriesArray = filteredCategories.filter(category => selectedCategories.includes(category));
  const unselectedCategoriesArray = filteredCategories.filter(category => !selectedCategories.includes(category));

  // Sort both arrays based on their index
  selectedCategoriesArray.sort((a, b) => filteredCategories.indexOf(a) - filteredCategories.indexOf(b));
  unselectedCategoriesArray.sort((a, b) => filteredCategories.indexOf(a) - filteredCategories.indexOf(b));

  const sortedCategories = [...selectedCategoriesArray, ...unselectedCategoriesArray];

  return (
    <div className='container'>
      <div className='header'>
        <h2>Kategoriler</h2>
        <div className='search-container'>
          <input
            type='text'
            placeholder='kategori ara....'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={require('../assets/search.svg').default} alt='Search' className='search-icon' />
        </div>
      </div>
      <div className='innerContainer'>
        <ul>
          {sortedCategories.map((category, index) => (
            <li key={`${category}-${index}`}>
              <div className='checkbox-container'>
                <input
                  type='checkbox'
                  id={`checkbox-${category}-${index}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                />
                <label htmlFor={`checkbox-${category}-${index}`} className='checkbox-label'>
                  {category}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button>Ara</button>
    </div>
  );
};

export default Multiselect;
