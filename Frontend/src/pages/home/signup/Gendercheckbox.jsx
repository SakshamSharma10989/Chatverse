import React from 'react';

const Gendercheckbox = ({ onCheckBox, selectedGender }) => {
  const handleClick = (gender) => {
    if (selectedGender === gender) {
      onCheckBox(""); // uncheck if same
    } else {
      onCheckBox(gender); // set new
    }
  };

  return (
    <div className="flex gap-6 pt-2 text-sm text-gray-300">
      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text text-gray-300">Male</span>
          <input
            type="checkbox"
            className="checkbox bg-[#1e293b] border-gray-600 accent-blue-500"
            checked={selectedGender === "male"}
            onChange={() => handleClick("male")}
          />
        </label>
      </div>

      <div className="form-control">
        <label className={`label gap-2 cursor-pointer`}>
          <span className="label-text text-gray-300">Female</span>
          <input
            type="checkbox"
            className="checkbox bg-[#1e293b] border-gray-600 accent-pink-500"
            checked={selectedGender === "female"}
            onChange={() => handleClick("female")}
          />
        </label>
      </div>
    </div>
  );
};

export default Gendercheckbox;
