import React from 'react';
import { DotLoader } from 'react-spinners';

interface LoaderProps {
    isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({isLoading}) => {
    return (
        <div
          style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
          }}
      >
        <DotLoader
          color="#fff240"
          loading={isLoading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
}

export default Loader