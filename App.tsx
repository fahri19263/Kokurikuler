import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { CreatorPage } from './pages/CreatorPage';
import { ProfilePage } from './pages/ProfilePage';

const App: React.FC = () => {
    const [view, setView] = useState('landing');

    // FIX: Add effect to handle mobile viewport height correctly (`100vh` issue).
    // This sets a CSS variable `--vh` to the actual inner window height.
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVh();
        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh);
    }, []);

    // Scroll to top on view change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const renderView = () => {
        // Add a key to force re-render and trigger animation on view change
        switch (view) {
            case 'creator':
                return <CreatorPage key="creator" onNavigateHome={() => setView('landing')} />;
            case 'profile':
                return <ProfilePage key="profile" onNavigateHome={() => setView('landing')} />;
            case 'landing':
            default:
                return (
                    <LandingPage
                        key="landing"
                        onNavigateToCreator={() => setView('creator')}
                        onNavigateToProfile={() => setView('profile')}
                    />
                );
        }
    };

    return <div className="page">{renderView()}</div>;
};

export default App;
