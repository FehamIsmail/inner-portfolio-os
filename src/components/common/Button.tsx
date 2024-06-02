import React from 'react';

interface ButtonProps {
    label: string;
    form?: boolean;
    onClick: (e: React.FormEvent) => void | (() => void);
    backgroundColor?: string;
    hoverColor?: string;
    disabled?: boolean;
    className?: string;
}

const Button = (props: ButtonProps) => {
    const buttonClasses = `w-full h-full cursor-pointer border-2 border-retro-dark bg-retro-white
    focus:outline-retro-dark focus:outline focus:outline-1 disabled:cursor-not-allowed disabled:bg-retro-medium
    hover:bg-retro-medium text-retro-light py-1 px-3 rounded-sm ${props.className}`;
    const [hover, setHover] = React.useState(false);

    return (
        <>
            {props.form ? (
                <input
                    className={buttonClasses}
                    type="submit"
                    value={props.label}
                    disabled={props.disabled}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{
                        backgroundColor: hover ? props.hoverColor : props.backgroundColor,
                    }}
                />
            ) : (
                <button
                    className={buttonClasses}
                    onClick={props.onClick}
                    disabled={props.disabled}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{
                        backgroundColor: hover ? props.hoverColor : props.backgroundColor,
                    }}
                >
                    {props.label}
                </button>
            )}
        </>
    );
};

export default Button;