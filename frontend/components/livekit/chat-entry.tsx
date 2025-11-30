import { format } from 'date-fns';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  message: string;
  timestamp: number;
  messageOrigin?: 'local' | 'remote';
  hasBeenEdited?: boolean;
  locale?: string;
}

export const ChatEntry = forwardRef<HTMLLIElement, ChatEntryProps>(
  (
    {
      message,
      timestamp,
      messageOrigin = 'local',
      hasBeenEdited = false,
      locale = 'en-US',
      className,
      ...props
    },
    ref
  ) => {
    const isUser = messageOrigin === 'local';
    const time = format(new Date(timestamp), 'h:mm a');

    return (
      <li
        ref={ref}
        className={cn(
          'flex w-full flex-col gap-1 px-4 py-2 transition-all duration-300 ease-out',
          isUser ? 'items-end' : 'items-start',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'bg-[#2874F0] text-white rounded-br-none'
              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
          )}
        >
          {message}
        </div>
        <span className="text-[10px] font-medium text-slate-400 px-1">
          {isUser ? 'You' : 'Flipkart Voice'} • {time}
          {hasBeenEdited && <span className="italic ml-1">(edited)</span>}
        </span>
      </li >
    );
  }
);

ChatEntry.displayName = 'ChatEntry';
