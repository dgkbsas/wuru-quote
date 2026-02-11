import wuruLogo from '@/assets/wuru-logo-new.png';

const PoweredByFooter = () => {
  return (
    <div className="fixed bottom-4 right-6 flex items-center gap-1 z-50">
      <span className="text-xs tracking-wide text-neutral-500 uppercase mt-0.5">
        Powered by
      </span>
      <img src={wuruLogo} alt="WÚRU" className="h-3 object-contain" />
    </div>
  );
};

export default PoweredByFooter;
