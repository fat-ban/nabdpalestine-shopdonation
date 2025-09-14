import React, { useState } from 'react';
import { Shield, Heart, CheckCircle, Globe, Users, Target, TrendingUp, Award, Link as LinkIcon, ExternalLink, MapPin, Calendar, DollarSign, Zap, Lock, Eye, BarChart3, Handshake } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { OrganizationDetails } from './components/OrganizationDetails';
import { Organization } from '../../features/donations/types';

export function OrganizationsPage() {
  const { language } = useTheme();

  // Mock organizations data, replace with data from your API
  const partnerOrganizations: Organization[] = [
    {
      id: 1,
      name: 'Palestine Children Foundation',
      description: 'Dedicated to supporting and educating Palestinian children in occupied territories',
      website: 'pcf.org',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Rebuild Palestine Initiative',
      description: 'Focuses on rebuilding infrastructure and destroyed homes',
      website: 'rpi.org',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const blockchainStats = {
    totalTransactions: 15647,
    totalTransparency: 97.5,
    averageSpeed: 2.3,
    zeroFees: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
      <div className="relative bg-gradient-to-br from-palestine-green via-palestine-white to-palestine-red overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow-lg">
            {language === 'ar' ? 'شركاؤنا في التأثير' : 'Our Impact Partners'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 text-shadow">
            {language === 'ar' 
              ? 'الجمعيات والمؤسسات التي نتعاون معها لتحقيق التأثير الإيجابي - بشفافية كاملة عبر البلوك تشين'
              : 'Organizations and institutions we collaborate with to create positive impact - with full transparency through blockchain'
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {partnerOrganizations.map((org) => (
            <OrganizationDetails key={org.id} organization={org} />
          ))}
        </div>
      </div>
    </div>
  );
}
