import React from 'react';

const Greeting = ({ username }) => {
    const currentHour = new Date().getHours();
    let greeting = "Hola";

    if (currentHour < 12) {
        greeting = "Buenos días";
    } else if (currentHour < 18) {
        greeting = "Buenas tardes";
    } else {
        greeting = "Buenas noches";
    }

    return (
        <div className="greeting">
            <p>{greeting}, {username}.</p>
            <p>Son las {new Date().toLocaleTimeString()}.</p>
        </div>
    );
};

export default Greeting;
