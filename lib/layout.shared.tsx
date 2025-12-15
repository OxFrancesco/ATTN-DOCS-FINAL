import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          {/* Logo scaled up: h-16 (64px) is 2x the previous 32px */}
          <Image
            src="/Logo-Light.svg"
            alt="AttentionPad"
            width={240}
            height={64}
            className="dark:hidden w-auto h-12 md:h-16"
            priority
          />
          <Image
            src="/Logo-Dark.svg"
            alt="AttentionPad"
            width={240}
            height={64}
            className="hidden dark:block w-auto h-12 md:h-16"
            priority
          />
        </div>
      ),
      transparentMode: 'top',
    },
    githubUrl: 'https://github.com/AttentionPad', 
  };
}
