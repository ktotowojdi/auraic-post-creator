/* eslint-disable @next/next/no-img-element */
export default function AuraicLogo() {
  return (
    <div className="w-[180px] h-[98px] flex items-center justify-center">
      <img
        src="/logo.svg"
        alt="AURAIC"
        className="w-[139px] h-[27px]"
        style={{ filter: 'brightness(0) invert(1)', transform: 'scaleY(-1)' }}
      />
    </div>
  );
}
