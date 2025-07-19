import React from "react";
import Headerlayout from "./HeaderLayout";
import { Link } from "react-router-dom";
const HomeScreen = () => {
    return (
        <>
            <div className="">
                <Headerlayout>
                    <div className="text-center px-4">
                        <h3 className="boldCalibri text-2xl md:text-[46px] text-white leading-[28px] md:leading-[67px] mt-[30px] md:mt-[116px]">
                            THE SUPERHERO OF OUR SUCCESS You :
                        </h3>

                        <div className="md:text-[41px] text-2xl text-white mt-[40px] md:mt-[140px] leading-[55px]">
                            <span className="CalibrRegular">
                                The momentum that smashes past every boundary, the power that overcomes every challenge in the way. Yes, YOU are the unstoppable force that is propelling us toward
                            </span>{" "}
                            <b className="text-white font-bold">Accelerate 2030</b>. And every champion should look the part. So, strike your most heroic pose and watch AI transform you into your superhero avatar!
                        </div>

                        <div className="mt-[100px] md:mt-[200px]">
                            <Link to="/GenderSelection">
                                <button
                                    className="
          bg-white 
          px-6 py-4 
          md:px-[42px] md:py-[37px]
          rounded-[10px] md:rounded-[20px]
          uppercase boldCalibri 
          text-xl md:text-[46px] 
          text-black 
          leading-[28px] md:leading-[67px] 
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