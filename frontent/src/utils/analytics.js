export const initAnalytics = () => {
  if (typeof window !== 'undefined' && import.meta.env.PROD) {
    // Initialize Google Analytics, Mixpanel, etc.
    // Example with Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (import.meta.env.PROD) {
    // Send to analytics
    console.log('Track:', eventName, properties);
  }
};