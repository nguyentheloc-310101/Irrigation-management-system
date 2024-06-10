import { LeftContent } from '@/components/Calender/LeftContent';
import { RightContent } from '@/components/Calender/RightContent';
import SmallPaddingLayout from '@/components/Layouts/SmallPaddingLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'This is Calendar',
};

const CalendarPage = () => {
  return (
    <SmallPaddingLayout>
      <div className="flex items-start justify-start gap-[24px]">
        <div className="w-[400px]  h-auto">
          <LeftContent />
        </div>
        <div className="w-full overflow-y-scroll p-[24px] bg-[white]">
          <RightContent />
        </div>
      </div>
    </SmallPaddingLayout>
  );
};

export default CalendarPage;
