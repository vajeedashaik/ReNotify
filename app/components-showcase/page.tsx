'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent 
} from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext 
} from '@/components/ui/carousel';
import { 
  HoverCardRoot, HoverCardTrigger, HoverCardContent 
} from '@/components/ui/HoverCard';
import { 
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger 
} from '@/components/ui/menubar';
import { 
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, 
  NavigationMenuList, NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Typography } from '@/components/ui/typography';
import { AvatarRoot, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Chart } from '@/components/ui/Chart';
import { 
  Package, Users, Shield, Calendar as CalendarIcon, 
  Settings, Bell, Home, FileText 
} from 'lucide-react';

export default function ComponentsShowcase() {
  const chartData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
  ];

  return (
    <div className="min-h-screen p-8 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Typography variant="h1">Components Showcase</Typography>
        <Typography variant="muted" className="mt-2">
          Explore all the enhanced UI components with glassmorphism and creative hover effects
        </Typography>
      </motion.div>

      {/* Typography */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Typography</Typography>
        <Typography variant="h1">Heading 1 with Gradient</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="p">Regular paragraph text with proper spacing and readability.</Typography>
        <Typography variant="lead">Lead text for important information.</Typography>
        <Typography variant="muted">Muted text for secondary information.</Typography>
      </section>

      {/* Badges */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Badges</Typography>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Avatar */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Avatar</Typography>
        <div className="flex gap-4">
          <AvatarRoot>
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </AvatarRoot>
          <AvatarRoot className="h-16 w-16">
            <AvatarFallback>JD</AvatarFallback>
          </AvatarRoot>
          <AvatarRoot className="h-20 w-20">
            <AvatarFallback>AB</AvatarFallback>
          </AvatarRoot>
        </div>
      </section>

      {/* Accordion */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Accordion</Typography>
        <AccordionRoot type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is ReNotify?</AccordionTrigger>
            <AccordionContent>
              ReNotify is a comprehensive warranty and AMC management system that helps businesses track customer purchases and manage service reminders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              Simply upload your customer dataset, and ReNotify will automatically track warranties, AMCs, and service due dates.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we use industry-standard encryption and security practices to protect your data.
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </section>

      {/* Calendar */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Calendar</Typography>
        <div className="flex justify-center">
          <Calendar />
        </div>
      </section>

      {/* Carousel */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Carousel</Typography>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="glass rounded-lg p-6 text-center">
                  <Typography variant="h3">Slide {index + 1}</Typography>
                  <Typography variant="muted">Carousel content with glassmorphism</Typography>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Chart */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Chart</Typography>
        <Chart data={chartData} type="bar" height={250} />
      </section>

      {/* Tooltip */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Tooltip</Typography>
        <TooltipProvider>
          <div className="flex gap-4">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button className="glass-button">Hover me</button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip with glassmorphism</p>
              </TooltipContent>
            </TooltipRoot>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button className="glass-button">Another tooltip</button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tooltips provide helpful context</p>
              </TooltipContent>
            </TooltipRoot>
          </div>
        </TooltipProvider>
      </section>

      {/* Hover Card */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Hover Card</Typography>
        <HoverCardRoot>
          <HoverCardTrigger asChild>
            <button className="glass-button">Hover for details</button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2">
              <Typography variant="h4">ReNotify</Typography>
              <Typography variant="muted">
                A modern warranty management system with beautiful UI components.
              </Typography>
            </div>
          </HoverCardContent>
        </HoverCardRoot>
      </section>

      {/* Toggle Group */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Toggle Group</Typography>
        <ToggleGroup type="single">
          <ToggleGroupItem value="left" aria-label="Left aligned">
            <FileText className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center aligned">
            <Home className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right aligned">
            <Settings className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Menubar */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Menubar</Typography>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* Navigation Menu */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Navigation Menu</Typography>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="glass rounded-lg p-4 w-[200px]">
                  <Typography variant="h4">Products</Typography>
                  <Typography variant="muted">Manage your products</Typography>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Customers</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="glass rounded-lg p-4 w-[200px]">
                  <Typography variant="h4">Customers</Typography>
                  <Typography variant="muted">View customer data</Typography>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      {/* Aspect Ratio */}
      <section className="glass rounded-lg p-6 space-y-4">
        <Typography variant="h2">Aspect Ratio</Typography>
        <div className="w-full max-w-md">
          <AspectRatio ratio={16 / 9} className="glass rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-500 to-accent-600">
              <Typography variant="h3" className="text-white">16:9 Aspect Ratio</Typography>
            </div>
          </AspectRatio>
        </div>
      </section>
    </div>
  );
}
