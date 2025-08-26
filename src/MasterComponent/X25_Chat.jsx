import React from "react";
import { Link } from "react-router-dom";
const X25_Chat_Inputs = () => {
    return (
        <>
            <div
                className="max-w-md mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-start"
                style={{ height: '100dvh' }}
            >
                <div className="w-[120px] h-[25px] sm:w-[161px] sm:h-[33px] max-w-sm sm:max-w-md md:max-w-lg mt-[100px] sm:mt-8 md:mt-16 z-50">
                    <Link to='/'>
                        <img
                            src="./Bne25.png"
                            className="w-full h-auto object-contain"
                            alt="Bne25 Logo"
                        />
                    </Link>
                </div>
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6 md:mt-10">
                    <img
                        src="./audience.png"
                        className="w-full h-auto object-cover rounded-lg"
                        alt="Audience"
                    />
                </div>
                <div className="">
                    <p className="TestNational2Bold text-[18px] sm:text-[24px] mt-[30px] sm:mt-[49px] leading-[24px] sm:leading-[30px] md:px-0 pr-[50px]">
                        It's all about getting to know you — not just what you do, but what drives you and what matters to you.
                    </p>

                </div>
                <div className="w-[120px] h-[45px] sm:w-[149px] sm:h-[56px] mt-[30px] sm:mt-[44px] z-50">
                    <Link
                        to='/QuestionScreen'
                        onClick={() => localStorage.removeItem('userResponses')}
                    >
                        <img src="./Button.png" className="w-full h-auto object-contain" />
                    </Link>
                </div>
            </div>
        </>
    )
}
export default X25_Chat_Inputs