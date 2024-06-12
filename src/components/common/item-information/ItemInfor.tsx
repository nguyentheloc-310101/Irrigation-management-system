type ItemInfoProps = {
  label: string;
  info: any;
};
export const ItemInfo = ({ label, info }: ItemInfoProps) => {
  return (
    <div className="flex w-full items-center justify-between text-[14px]">
      <div className="text-[#8F9499] font-light">{label}</div>
      <div className="text-[black]">{info}</div>
    </div>
  );
};
