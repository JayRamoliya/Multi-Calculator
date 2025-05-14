
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Advanced = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Advanced Calculator</h1>
          <p className="text-muted-foreground">
            This feature is coming soon! The advanced calculator will include graphing capabilities,
            matrix operations, equation solving, and unit conversions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Advanced;
