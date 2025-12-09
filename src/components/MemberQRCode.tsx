import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Wallet, Smartphone, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MemberQRCodeProps {
  memberId: string;
  memberName: string;
  username: string;
}

export const MemberQRCode = ({ memberId, memberName, username }: MemberQRCodeProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a unique member code that encodes the member ID
  const memberCode = `PICKLE-${memberId.slice(0, 8).toUpperCase()}`;
  
  // QR code data contains member info for scanning
  const qrData = JSON.stringify({
    type: "pickle_member",
    id: memberId,
    code: memberCode,
    name: memberName,
    username: username,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(memberCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Member code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToWallet = () => {
    toast({
      title: "Coming Soon!",
      description: "Apple Wallet integration is being set up. Check back soon!",
    });
  };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-4">
        {/* Compact QR Code */}
        <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
          <QRCodeSVG
            value={qrData}
            size={64}
            level="H"
            includeMargin={false}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Member Pass</span>
          </div>
          <button 
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-sm font-mono font-semibold tracking-wider hover:text-primary transition-colors"
          >
            {memberCode}
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          <p className="text-xs text-muted-foreground mt-1">
            Check-in, earn points & court access
          </p>
        </div>

        {/* Add to Wallet Button */}
        <Button 
          onClick={handleAddToWallet}
          size="sm"
          className="bg-black hover:bg-black/90 text-white shrink-0"
        >
          <Wallet className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
