import React, { useState } from "react";
import Headerlayout from "./HeaderLayout";
import { Link } from "react-router-dom";

const GenderSelection = () => {
    const [selectedGender, setSelectedGender] = useState(null);

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
        // Store gender selection in localStorage for use in other components
        localStorage.setItem("selectedGender", gender);
    };

    return (
        <>
            <div className="">
                <Headerlayout>
                    <div className="">
                        <h3 className="boldCalibri text-2xl md:text-[64px] text-white leading-[28px] md:leading-[67px] md:mt-[153px] mt-[30px]">
                            Select you gender
                        </h3>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-[43px] px-4 mt-[30px] md:mt-[80px] lg:mt-[127px]">
                        {/* MALE CARD */}
                        <div
                            className={`w-[140px] sm:w-[200px] md:w-[270px] lg:w-[335px] h-auto md:h-[402px] rounded-[20px] flex justify-center items-center flex-col gap-6 md:gap-[60px] cursor-pointer transition-all duration-300 ${selectedGender === 'male'
                                ? 'bg-[#47667C] border-[4px] md:border-[6px] border-[#8498A7]'
                                : 'bg-white'
                                }`}
                            onClick={() => handleGenderSelect('male')}
                        >
                            <img
                                src={`${selectedGender === 'male' ? './malehover.png' : './Vector.png'
                                    }`}
                                className="w-[80px] sm:w-[100px] md:w-[135px] h-auto"
                                alt="Male"
                            />
                            <h3
                                className={`boldCalibri text-lg sm:text-2xl md:text-[36px] lg:text-[58px] ${selectedGender === 'male' ? 'text-white' : 'text-[#002A49]'
                                    }`}
                            >
                                Male
                            </h3>
                        </div>

                        {/* FEMALE CARD */}
                        <div
                            className={`w-[140px] sm:w-[200px] md:w-[270px] lg:w-[335px] h-auto md:h-[402px] rounded-[20px] flex justify-center items-center flex-col gap-6 md:gap-[60px] cursor-pointer transition-all duration-300 ${selectedGender === 'female'
                                ? 'bg-[#47667C] border-[4px] md:border-[6px] border-[#8498A7]'
                                : 'bg-white'
                                }`}
                            onClick={() => handleGenderSelect('female')}
                        >
                            <img
                                src={`${selectedGender === 'female'
                                    ? './femalenewhover.png'
                                    : './femalerHover.png'
                                    }`}
                                className="w-[80px] sm:w-[100px] md:w-[106px] h-auto md:h-[162px]"
                                alt="Female"
                            />
                            <h3
                                className={`boldCalibri text-lg sm:text-2xl md:text-[36px] lg:text-[58px] ${selectedGender === 'female' ? 'text-white' : 'text-[#002A49]'
                                    }`}
                            >
                                Female
                            </h3>
                        </div>
                    </div>

                    <div className="mb-[40px] text-center">

                        <Link to='/PhotoBoothScreen'>
                            <button
                                className="
    bg-white 
    px-12 py-4 
    md:px-[170px] md:py-[37px]
    md:rounded-[20px] 
rounded-[10px]
    uppercase boldCalibri 
    text-xl md:text-[72px] 
    text-[#002A49] 
    leading-[28px] md:leading-[67px] GenderSelection
 md:mt-[170px]
 mt-[30px]

  "
                            >
                                Next
                            </button>
                        </Link>

                        <p className="CalibriItalic text-white md:mt-[153px] mt-[30px] text-2xl md:text-[58px]">
                            #abcd
                        </p>

                    </div>


                </Headerlayout>
            </div>
        </>
    )

}
export default GenderSelection