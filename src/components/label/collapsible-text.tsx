import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Iconify } from '../iconify';

interface CollapsibleTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function CollapsibleText({ text, maxLines = 10, className = '' }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    const container = containerRef.current;
    if (!element || !container) return;

    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const collapsed = lineHeight * maxLines;

    setCollapsedHeight(collapsed);

    const fullHeight = element.scrollHeight;
    setIsOverflowing(fullHeight > collapsed);

    // Set initial maxHeight
    container.style.maxHeight = `${collapsed}px`;
  }, [text, maxLines]);

  const toggleExpand = () => {
    const container = containerRef.current;
    if (!container || !textRef.current) return;

    const fullHeight = textRef.current.scrollHeight;

    if (isExpanded) {
      container.style.maxHeight = `${collapsedHeight}px`;
    } else {
      container.style.maxHeight = `${fullHeight}px`;
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <div
          ref={textRef}
          style={{
            whiteSpace: 'pre-line',
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>

      {isOverflowing && (
        <Button
          variant="text"
          size="small"
          onClick={toggleExpand}
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            color: '#1976d2',
          }}
        >
          {isExpanded ? (
            <>
              <Iconify
                icon="mynaui:chevron-up-solid"
                style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
              />
              Thu gọn
            </>
          ) : (
            <>
              <Iconify
                icon="mynaui:chevron-down-solid"
                style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
              />
              Xem thêm
            </>
          )}
        </Button>
      )}
    </div>
  );
}
