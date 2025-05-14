
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/calculator/ThemeToggle';

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the calculator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Dark Mode</h3>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calculator Settings</CardTitle>
              <CardDescription>
                Configure how the calculator works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                More settings coming soon, including precision adjustments,
                angle units (degrees/radians), and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
