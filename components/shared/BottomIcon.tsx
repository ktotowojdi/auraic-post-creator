/* eslint-disable @next/next/no-img-element */
import { BottomIconType } from '@/lib/types';

interface Props {
  type?: BottomIconType;
}

export default function BottomIcon({ type = 'arrow' }: Props) {
  if (type === 'bookmark') {
    return (
      <div className="w-[100px] h-[100px] flex items-center justify-center">
        <img
          src="/bookmark.svg"
          alt=""
          className="w-[54px] h-[70px]"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.64 }}
        />
      </div>
    );
  }

  return (
    <div className="w-[100px] h-[100px] flex items-center justify-center">
      <img
        src="/arrow-right.svg"
        alt=""
        className="w-[63px] h-[47px]"
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.64 }}
      />
    </div>
  );
}
