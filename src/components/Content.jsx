import React from "react";

const Content = ({
    title = "Ride with\nthe STARS!",
    buttonText = "Start Now",
    onButtonClick
}) => {
    return (
        <>
            <div className="mt-[80px] sm:mt-[120px] lg:mt-[195.5px]">
                <h3 className="text-[#5C2B62] uppercase text-[40px] sm:text-[60px] lg:text-[100.48px] leading-[120%] sm:leading-[125%] lg:leading-[127%] NeueMontrealBold font-bold px-2">
                    Ride with the
                    <br />
                    STARS!
                </h3>
            </div>
            <div className="mt-[100px] sm:mt-[150px] md:mt-[224px] xl:mb-10">
                <button
                    onClick={onButtonClick}
                    className="px-[60px] py-[20px] sm:px-[100px] sm:py-[25px] lg:px-[137px] lg:py-[29px] bg-[#F5EA60] text-black text-[18px] sm:text-[22px] lg:text-[28px] font-bold rounded-full hover:bg-[#F0E050] transition-colors duration-200"
                >
                    {buttonText}
                </button>
            </div>
        </>
    );
};

export default Content; 