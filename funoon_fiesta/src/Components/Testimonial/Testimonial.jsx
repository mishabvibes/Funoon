import React, { useState } from 'react';
import aliKuttyUsthad from '../../assets/img/Usthads/ali-kutty-usthad.webp';
import kottumalaUsthad from '../../assets/img/Usthads/kottumala-usthad.webp';
import asgaraliUsthad from '../../assets/img/Usthads/asgarali-usthad.webp';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';

const Testimonial = () => {
    const Testimonial_data = [
        {
            img: aliKuttyUsthad,
            content_text: "Funun Fiesta is shaping history and engaging with the present. This platform beautifully conveys the messages of Islam to society.",
            testimonial_name: 'Shikhul Jamia K.Alikutty Musliyar',
            text_block: 'Principal of college',
        },
        {
            img: kottumalaUsthad,
            content_text: "Funun Fiesta is a unique platform connecting art with purpose. It beautifully shares the inspiring messages of Islam with society.",
            testimonial_name: 'Moideen Kutty Musliyar Kottumala',
            text_block: 'Proffeser of college',
        },
        {
            img: asgaraliUsthad,
            content_text: "Funun Fiesta beautifully blends creativity with purpose. It serves as a platform to share the inspiring messages of Islam with society.",
            testimonial_name: 'Asgar Ali Faizy Pattikkad',
            text_block: 'Lecture',
        },
    ];
    
    const [current, setCurrent] = useState(0);
    const length = Testimonial_data.length;
    
    const previous = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };
    
    const next = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };
    
    return (
        <div className="px-8 md:px-12 lg:px-24">
            <section className="flex items-center justify-center py-4 md:py-6">
                <div className="max-w-lg md:max-w-2xl lg:max-w-3xl">
                    <AnimatePresence mode="wait">
                        {Testimonial_data.map((item, index) => (
                            index === current && (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div className="pb-3 flex flex-col sm:flex-row items-start gap-3">
                                        <img
                                            src="https://assets.website-files.com/5fef5619b640934b33c2385e/5ff6a53da27356854576b920_Group%2058.svg"
                                            alt=""
                                            className="w-6 md:w-8"
                                        />
                                        <h2 className="text-gray-800 dark:text-white text-base sm:text-lg md:text-xl font-semibold">
                                            {item.content_text}
                                        </h2>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            <div>
                                                <img
                                                    src={item.img}
                                                    alt=""
                                                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-pink-600 rounded-full p-0.5"
                                                />
                                            </div>
                                            <div className="text-left">
                                                <h6 className="text-xs sm:text-sm font-semibold">
                                                    {item.testimonial_name}
                                                </h6>
                                                <span className="text-xs text-gray-500">
                                                    {item.text_block}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gray-800 p-1.5 sm:p-2 cursor-pointer rounded"
                                                onClick={previous}
                                            >
                                                <IoIosArrowBack className="text-white" />
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gray-800 p-1.5 sm:p-2 cursor-pointer rounded"
                                                onClick={next}
                                            >
                                                <IoIosArrowForward className="text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default Testimonial;