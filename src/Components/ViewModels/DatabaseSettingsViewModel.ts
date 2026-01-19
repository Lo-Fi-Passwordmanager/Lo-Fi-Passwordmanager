import {Settings} from "../../Model/Settings";

import { useState, useEffect } from 'react';
import type Database from "../../Model/Database.ts";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useDatabaseSettingsViewModel = () => {


    // Reactive state to store values during runtime
    const [settingsOpen, setSettingsOpen] = useState(false);


    return {
        settingsOpen,
        setSettingsOpen,
    };
};