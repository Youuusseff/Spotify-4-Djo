"use client";

import Box from "@/components/Box";

import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <Box className="flex h-full items-center justify-center">
            <BounceLoader color="#22c55e" size={40} />
        </Box>
    );
}

export default Loading;