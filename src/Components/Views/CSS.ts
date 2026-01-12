import React from 'react';

export const baseButtonStyle: React.CSSProperties = {
    margin: 20,
};

export const hoverStyle: React.CSSProperties = {
    // Styles when the button is hovered
};

export const listingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50vmin',
    gap: '8px',
}

export const loginViewStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#282c34",
    color: "white",
    height: "100vh",
    width: "100vw",
};

export const headerStyle: React.CSSProperties = {
    fontSize: "3em",
    marginBottom: "20px",
};

export const dialogOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
};
export const dialogStyle: React.CSSProperties = { /* ... */
    backgroundColor: '#282c34',
    padding: 20,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: 300
};
