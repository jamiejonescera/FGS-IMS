import React from 'react';

const CategoryDescription = () => {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-md mb-6">
      <div className="flex justify-between">
        {/* Asset Categories Section */}
        <div className="w-1/2 pr-4">
          <h4 className="font-semibold text-sm text-gray-800">Asset Categories for School</h4>
          <div className="mt-1 space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-bold">Classroom Furniture:</span> Desks, chairs, bookshelves, anything related to classroom furnishings
            </div>
            <div>
              <span className="font-bold">Electronics:</span> Projectors, laptops, smartboards, anything involving technology and electronics
            </div>
            <div>
              <span className="font-bold">Sports Equipment:</span> Gym machines, basketball hoops, anything related to physical activities and sports
            </div>
            <div>
              <span className="font-bold">Infrastructure:</span> Air conditioners, lockers, laboratory equipment, anything supporting the school infrastructure
            </div>
            <div>
              <span className="font-bold">Library Resources:</span> Digital kiosks, library furniture, anything related to books, reading, and library systems
            </div>
          </div>
        </div>

        {/* Item Categories Section */}
        <div className="w-1/2 pl-4">
          <h4 className="font-semibold text-sm text-gray-800">Item Categories for School</h4>
          <div className="mt-1 space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-bold">Stationery Supplies:</span> Pens, notebooks, erasers, anything related to writing and note-taking
            </div>
            <div>
              <span className="font-bold">Teaching Materials:</span> Whiteboard markers, chalk, flashcards, anything related to teaching and educational materials
            </div>
            <div>
              <span className="font-bold">Art Supplies:</span> Paints, brushes, drawing paper, anything related to arts and crafts supplies
            </div>
            <div>
              <span className="font-bold">Cleaning Supplies:</span> Mop heads, detergents, trash bags, anything related to cleaning and sanitation
            </div>
            <div>
              <span className="font-bold">Medical Supplies:</span> Bandages, first-aid kits, hand sanitizers, anything related to health and safety
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDescription;
