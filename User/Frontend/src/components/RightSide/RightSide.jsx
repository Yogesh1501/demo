import React from 'react';
import SocietyNotify from "../SocietyNotify/SocietyNotify"; // Ensure this path is correct
import SocietyEvents from "../SocietyEvent/SocietyEvents"; // Correct this path too if necessary

const RightSide = () => {
    return (
        <div>
            <SocietyNotify />
            <SocietyEvents />
        </div>
    );
};

export default RightSide;
