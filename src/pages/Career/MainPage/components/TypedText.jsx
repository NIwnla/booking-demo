import React from "react";

const TypedText = ({ text, inView, delay = 0 }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.1s ease ${delay + index * 0.1}s`,
                        display: 'inline-block'
                    }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};
export default TypedText;