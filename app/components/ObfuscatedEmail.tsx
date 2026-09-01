import { useState, useEffect } from "react";

interface ObfuscatedEmailProps {
  email: string;
  className?: string;
  displayAs?: string;
}

export function ObfuscatedEmail({
  email,
  className,
  displayAs,
}: ObfuscatedEmailProps) {
  const [decoded, setDecoded] = useState<string>("");

  useEffect(() => {
    try {
      const [local, domain] = email.split("@");
      const decodedLocal = atob(local);
      const decodedDomain = atob(domain);
      setDecoded(`${decodedLocal}@${decodedDomain}`);
    } catch {
      setDecoded(email);
    }
  }, [email]);

  if (!decoded) return null;

  if (displayAs) {
    return <span className={className}>{displayAs}</span>;
  }

  return <span className={className}>{decoded}</span>;
}