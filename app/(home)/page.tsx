import Link from 'next/link';
import { DottedBackground } from '@/components/dotted-background';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <DottedBackground />
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 w-full">
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
          Where the Next Generation of Projects Begins
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          AttentionPad is the premier launchpad within the Attention Ecosystem, ensuring high-quality engagement and sustainable growth for the next generation of decentralized applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/docs" 
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            Read Documentation
          </Link>
          <Link 
            href="https://attentionpad.com" 
            className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors text-center"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}
