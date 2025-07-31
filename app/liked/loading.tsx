"use client";

import Box from "@/components/Box";

import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <Box className="flex h-full items-center justify-center">
            <BounceLoader color="#ba2ce6" size={40} />
        </Box>
    );
}

export default Loading;