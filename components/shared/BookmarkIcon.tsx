/* eslint-disable @next/next/no-img-element */
export default function BookmarkIcon() {
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
