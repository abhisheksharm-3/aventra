import React from "react";

export const Background: React.FC = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
    <div className="absolute top-0 -left-40 md:-left-20 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-70 animate-[pulse_8s_infinite]" />
    <div className="absolute bottom-0 -right-40 md:-right-20 h-[500px] w-[500px] bg-blue-700/10 rounded-full blur-[100px] opacity-70 animate-[pulse_12s_infinite]" />
    <div className="absolute hidden md:block top-20 left-20 w-8 h-8 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
    <div className="absolute hidden md:block bottom-32 right-24 w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm" />
    <div className="absolute hidden md:block top-40 right-32 w-6 h-6 rounded-full bg-primary/10" />
  </div>
);

export const WaveDecoration: React.FC = () => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
    <svg className="relative block w-full h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
        className="fill-background/30 dark:fill-background/20"
      />
    </svg>
    <svg className="relative block w-full h-[40px] -mt-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
        className="fill-background/60 dark:fill-background/40"
        opacity=".25"
      />
    </svg>
    <svg className="relative block w-full h-[40px] -mt-[25px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path 
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
        className="fill-background dark:fill-background"
        opacity=".5"
      />
    </svg>
  </div>
);