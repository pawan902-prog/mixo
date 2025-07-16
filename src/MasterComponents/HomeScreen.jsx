import React from "react";
import Headerlayout from "./HeaderLayout";
import { Link } from "react-router-dom";
const HomeScreen = () => {
    return (
        <>
            <div className="">
                <Headerlayout>
                    <div className="text-center ">
                        <h3 className="boldCalibri text-2xl md:text-[58px] text-white leading-[28px] md:leading-[67px] md:mt-[116px] mt-[30px]">
                            You’re not just getting your photo taken — you’re capturing what acceleration looks like.
                        </h3>
                        <p className="CalibrRegular md:text-[48px] text-2xl   text-white md:mt-[46px] mt-[20px]">
                            As we drive toward Accelerate 2030, this moment is about recognizing the force behind the momentum — That is you. The one who speeds things up, pushes boundaries, and keeps us moving forward.
                        </p>
                        <p className="boldCalibri text-2xl md:text-[58px]  text-white leading-[28px] md:leading-[67px] md:mt-[46px] mt-[30px]">
                            📸 Step in, strike your pose, and watch our AI transform you into the superhero of acceleration.
                        </p>
                        <div className="mb-[40px]">
                            <p className="uppercase boldCalibri text-2xl md:text-[58px] text-white leading-[28px] md:leading-[67px] md:mt-[116px] mt-[30px] ">
                                Click Here to
                            </p>
                            <Link to='/GenderSelection'>
                                <button
                                    className="
    bg-white 
    px-6 py-4 
    md:px-[123px] md:py-[37px]
    md:rounded-[20px] 
rounded-[10px]
    uppercase boldCalibri 
    text-xl md:text-[72px] 
    text-black 
    leading-[28px] md:leading-[67px] 
 mt-[17px]
  "
                                >
                                    Accelerate
                                </button>
                            </Link>

                            <p className="CalibriItalic text-white md:mt-[83px] mt-[30px] text-2xl md:text-[58px]">
                                #abcd
                            </p>

                        </div>
                    </div>
                </Headerlayout>
            </div>
        </>
    )
}

export default HomeScreen