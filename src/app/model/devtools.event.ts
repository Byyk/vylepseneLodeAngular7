// Credit: https://github.com/sindresorhus/devtools-detect
export function detektorDevTools() {
    const devtools = {
        open: false,
        orientation: null
    };
    const threshold = 160;
    const emitEvent = function (state, orientation) {
        window.dispatchEvent(new CustomEvent('devtoolschange', {
            detail: {
                open: state,
                orientation: orientation
            }
        }));
    };

    setInterval(function () {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';


        if (!(heightThreshold && widthThreshold) &&
            // @ts-ignore
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
            if (!devtools.open || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }

            devtools.open = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.open) {
                emitEvent(false, null);
            }

            devtools.open = false;
            devtools.orientation = null;
        }
    }, 200);

    // @ts-ignore
    window.devtools = devtools;
}
