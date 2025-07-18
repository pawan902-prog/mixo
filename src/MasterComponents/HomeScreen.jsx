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
                            THE SUPERHERO OF OUR SUCCESS : YOU

                        </h3>
                        <span className="md:text-[48px] text-2xl   text-white md:mt-[46px] mt-[20px] ">
                            <span className="CalibrRegular">   The momentum that smashes past every boundary, the power that overcomes every challenge in the way. Yes, YOU are the unstoppable force that is propelling us toward  </span><b className="text-white font-bold">Accelerate 2030</b>. And every champion should look the part. So, strike your most heroic pose and watch AI transform you into your superhero avatar!

                        </span>

                        <div className="mb-[40px]">
                            {/* <p className="uppercase boldCalibri text-2xl md:text-[58px] text-white leading-[28px] md:leading-[67px] md:mt-[116px] mt-[30px] ">
                                Click Here to Begin
                        </p> */}
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
 mt-[47px]
  "
                                >
                                    Click here to begin
                                </button>
                            </Link>



                        </div>
                    </div>
                </Headerlayout>
            </div>
        </>
    )
}

export default HomeScreen