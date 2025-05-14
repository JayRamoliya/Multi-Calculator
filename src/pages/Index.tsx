
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BasicCalculator from '@/components/calculator/BasicCalculator';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <h2 className="text-2xl font-bold mb-6">Basic Calculator</h2>
        <BasicCalculator className="w-full max-w-md" />
      </div>
    </MainLayout>
  );
};

export default Index;
