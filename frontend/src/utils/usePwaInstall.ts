import { useEffect, useRef, useState } from 'react';

/** Tangani prompt "Pasang Aplikasi" (beforeinstallprompt) untuk PWA. */
export function usePwaInstall() {
  const evt = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const onPrompt = (e: any) => { e.preventDefault(); evt.current = e; setCanInstall(true); };
    const onInstalled = () => { evt.current = null; setCanInstall(false); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!evt.current) return;
    evt.current.prompt();
    await evt.current.userChoice;
    evt.current = null; setCanInstall(false);
  }

  return { canInstall, install };
}
