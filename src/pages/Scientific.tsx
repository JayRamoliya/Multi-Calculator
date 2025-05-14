
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ScientificCalculator from '@/components/calculator/ScientificCalculator';

const Scientific = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Scientific Calculator</h1>
        <div className="bg-card rounded-xl shadow-lg p-4">
          <ScientificCalculator />
        </div>
      </div>
    </MainLayout>
  );
};

export default Scientific;
