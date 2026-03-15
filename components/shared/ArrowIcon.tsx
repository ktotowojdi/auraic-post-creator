/* eslint-disable @next/next/no-img-element */
export default function ArrowIcon() {
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
