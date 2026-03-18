/**
 * Saadé Sound System
 * Providng auditory feedback for key POS actions.
 */

const SOUNDS = {
    SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2013/success-notification-alert-2298.wav',
    ORDER_PLACED: 'https://assets.mixkit.co/active_storage/sfx/2017/chime-notification-alert-2302.wav',
    READY: 'https://assets.mixkit.co/active_storage/sfx/2019/simple-notification-alert-2304.wav',
    CASH_REGISTER: 'https://assets.mixkit.co/active_storage/sfx/2103/cash-register-purchase-2331.wav',
    ERROR: 'https://assets.mixkit.co/active_storage/sfx/2012/error-notification-alert-2297.wav'
};

export const playSound = (type: keyof typeof SOUNDS) => {
    try {
        const audio = new Audio(SOUNDS[type]);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Audio playback blocked by browser/error:', e));
    } catch (err) {
        console.warn('Sound play failed', err);
    }
};
