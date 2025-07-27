"use client";

import { Switch } from "@/components/switch";
import useToggleState from "@/hooks/useToggleState";
import { useState } from "react";

const SwitchContent = () => {
    const toggleState = useToggleState();

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-semibold">
                Newest Songs
            </h1>
            <div className="flex items-center gap-4">
                <h3 className="text-white text-base md:text-lg font-semibold">Threads mode</h3>
                <Switch
                    id="thread-toggle"
                    className="bg-neutral-700 hover:bg-neutral-600 transition"
                    checked={toggleState.isEnabled}
                    aria-label="Toggle newest songs"
                    onCheckedChange={toggleState.setIsEnabled} />
            </div>
        </div>
    );
}

export default SwitchContent;
