import React from "react";

const Layout = ({ children }) => {
    return (
        <div
            className="min-h-screen flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="mt-[20px] sm:mt-[35px] lg:mt-[55px]">
                <img src="/logo.png" className="w-[150px] h-[65px] sm:w-[180px] sm:h-[78px] md:w-[405.69683837890625px] md:h-[176.15866088867188px]" />
            </div>
            {children}
        </div>
    );
};

export default Layout; 