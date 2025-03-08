import React from 'react';
import JobTypeFilterBox from './JobTypeFilterBox';

const EditJobTypeFilterBox = ({ onTypeChange, defaultValue }) => {
    return (
        <JobTypeFilterBox 
            onTypeChange={onTypeChange}
            defaultValue={defaultValue}
        />
    );
};

export default EditJobTypeFilterBox;