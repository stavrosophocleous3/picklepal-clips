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
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Smartphone className="w-5 h-5" />
        Member Pass
      </h3>
      
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <QRCodeSVG
              value={qrData}
              size={160}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* Member Code */}
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Member Code
          </p>
          <button 
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 mx-auto text-xl font-mono font-bold tracking-widest hover:text-primary transition-colors"
          >
            {memberCode}
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Usage Info */}
        <div className="text-center mb-4 space-y-1">
          <p className="text-xs text-muted-foreground">
            Scan for check-in, earn points, redeem rewards & court access
          </p>
        </div>

        {/* Add to Wallet Button */}
        <Button 
          onClick={handleAddToWallet}
          className="w-full bg-black hover:bg-black/90 text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Add to Apple Wallet
        </Button>
      </div>
    </div>
  );
};
