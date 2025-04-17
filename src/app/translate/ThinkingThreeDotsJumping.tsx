"use client"

import { motion, Variants } from "motion/react"

function ThinkingThreeDotsJumping() {
    const dotVariants: Variants = {
        jump: {
            y: -15,
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            },
        },
    }

    return (
        <motion.div
            animate="jump"
            transition={{ staggerChildren: -0.2, staggerDirection: -1, duration: 0.5, ease: "easeInOut" }}
            className="container"
            exit={{ opacity: 0 }}
        >   
            <motion.div variants={dotVariants} className="bg-gradient-to-r from-[#7367f0] via-[#ff6ec7] bg-[length:200%_200%] to-[#7367f0] bg-clip-text text-transparent text-[12px] font-[700]" >Thinking</motion.div>
            <motion.div className="dot bg-[#7367f0]" variants={dotVariants} />
            <motion.div className="dot bg-[#ff6ec7]" variants={dotVariants} />
            <motion.div className="dot bg-gradient-to-r from-[#7367f0] via-[#ff6ec7] bg-[length:200%_200%] to-[#7367f0]" variants={dotVariants} />
            <StyleSheet />
        </motion.div>
    )
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>
            {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }

            .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                will-change: transform;
            }
            `}
        </style>
    )
}

export default ThinkingThreeDotsJumping
