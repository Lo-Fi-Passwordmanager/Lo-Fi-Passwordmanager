import {afterEach, beforeEach, describe, it, expect} from "vitest";
import {Settings} from "../../src/Model/Settings";


describe('Settings', () => {
    let settings: Settings;
    //TODO settings vom local storage testen
    beforeEach(()=> {
        settings = Settings.getSettings();
    })

    afterEach(()=> {
        settings = null;
    })

    it('should be able to get Settings', () => {
        expect(settings).toBeInstanceOf(Settings);
    })

    it('should be a Singleton', () => {
        const settings2 = Settings.getSettings();
        expect(settings2).toBe(settings);
    })


    it('should be able to set and get dark mode', () => {
        settings.setDarkMode(true);
        expect(settings.getDarkMode()).toBe(true);
        settings.setDarkMode(false);
        expect(settings.getDarkMode()).toBe(false);
    })

    it('should be able to set and get the Synchronisation', () => {
        settings.setSynchronization(true);
        expect(settings.getSynchronization()).toBe(true);
        settings.setSynchronization(false);
        expect(settings.getSynchronization()).toBe(false);
    })


    it('should be able to set and get auto timeout', () => {
        settings.setTimeoutActive(true);
        expect(settings.getTimeoutActive()).toBe(true);
        settings.setTimeoutActive(false);
        expect(settings.getTimeoutActive()).toBe(false);
    });

    it('should be able to add a new server', ()=> {
        settings.addServer("name", "url");
        expect(settings.getServers().size).toBe(2);
    });

    it('should be able to set a new server', ()=> {
        settings.addServer("name", "url");
        expect(settings.getServers().size).toBe(2);
        settings.setServerUrl("name");
        expect(settings.getActiveServerName()).toBe("name");
    });

    it('should be able to remove a server', ()=> {
        settings.addServer("name", "url");
        expect(settings.getServers().size).toBe(2);
        settings.removeServer("name");
        expect(settings.getServers().size).toBe(1);
    });

    it('should return no server url if no server is set', ()=> {
        settings.setServerUrl("invalid server name");
        expect(settings.getServerName()).toBe("Unknown Server");
    });

    it('should activate P2P Synchronisation', ()=> {
        settings.setP2PActive(true);
        expect(settings.getP2P()).toBe(true);
        settings.setP2PActive(false);
        expect(settings.getP2P()).toBe(false);
    });

})