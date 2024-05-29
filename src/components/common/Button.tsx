import React from 'react';

interface ButtonProps {
    label: string;
    form?: boolean;
    onClick: (e: React.FormEvent) => void | (() => void);
    disabled?: boolean;
    className?: string;
}

const Button = (props: ButtonProps) => {
    const buttonClasses = `w-full h-full cursor-pointer border-2 border-retro-dark bg-retro-medium 
    focus:outline-retro-dark focus:outline focus:outline-1 disabled:cursor-not-allowed disabled:bg-retro-medium-dark
    hover:bg-retro-medium-dark text-retro-light py-2 px-4 rounded-sm ${props.className}`;

    return (
        <>
            {props.form ? (
                <input
                    className={buttonClasses}
                    type="submit"
                    value={props.label}
                    disabled={props.disabled}
                />
            ) : (
                <button
                    className={buttonClasses}
                    onClick={props.onClick}
                    disabled={props.disabled}
                >
                    {props.label}
                </button>
            )}
        </>
    );
};

export default Button;