import wuruLogo from '@/assets/wuru-logo-new.png';

const PoweredByFooter = () => {
  return (
    <div className="fixed bottom-4 right-6 flex flex-col items-center z-50">
      <span className="text-[8px] tracking-wide text-neutral-500 uppercase">
        Powered by
      </span>
      <img src={wuruLogo} alt="WÚRU" className="h-3 object-contain" />
    </div>
  );
};

export default PoweredByFooter;
